---
title: JWT et Spring Security
tags: [Spring, Java, Sécurité]
cover: https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=2000&q=80&auto=format&fit=crop
image: https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=2000&q=80&auto=format&fit=crop
article_header:
  type: overlay
  theme: dark
  background_color: '#123'
  background_image:
    src: https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=2000&q=80&auto=format&fit=crop
---

Un JWT (JSON Web Token) est un jeton signé que le serveur donne au client après sa connexion, et que le client renvoie à chaque requête pour prouver qui il est. Pas de session côté serveur, pas de table à interroger : la preuve est dans le jeton lui-même.

<!--more-->
## D'où on part
Dans [l'article sur CORS]({% post_url 2026-10-17-CORS %}), on a vu que dès qu'une requête contient un header `Authorization`, le navigateur envoie un preflight. Mais on n'a pas dit ce qu'il y avait dans ce header. Le plus souvent, c'est ça :
```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJmYWxsb3UifQ.Kx3...
```
Ce truc illisible, c'est un JWT. Voyons ce qu'il contient, comment il est vérifié, et comment le mettre en place proprement avec Spring Security.

## Session ou jeton ?
Il y a deux grandes façons de savoir qui fait une requête.

**Avec une session**, le serveur garde en mémoire (ou en base) la liste des utilisateurs connectés. Après le login, il envoie au navigateur un cookie avec un identifiant de session, et à chaque requête il va chercher cet identifiant dans sa liste. Simple, mais le serveur doit se souvenir de tout le monde. Si tu as trois instances de ton appli derrière un load balancer, il faut partager ces sessions entre elles.

**Avec un jeton**, le serveur ne retient rien. Après le login, il fabrique un jeton qui dit "cet utilisateur s'appelle fallou, il a le rôle USER, valable jusqu'à 14h15", le signe, et le donne au client. À chaque requête, le client renvoie le jeton, et le serveur vérifie juste la signature. N'importe quelle instance peut le faire, sans base de données ni cache partagé.

C'est ce qu'on appelle une API **stateless** : chaque requête contient tout ce qu'il faut pour être traitée.

## Ce qu'il y a dans un JWT
Un JWT, c'est trois morceaux séparés par des points :
```bash
xxxxx.yyyyy.zzzzz
header.payload.signature
```
Les deux premiers sont du JSON encodé en Base64URL. Si tu décodes le header :
```json
{
  "alg": "HS256"
}
```
Il indique l'algorithme de signature. Le payload contient les **claims**, les informations sur l'utilisateur :
```json
{
  "iss": "conso-linky",
  "sub": "fallou",
  "iat": 1792411200,
  "exp": 1792412100,
  "roles": ["ROLE_USER"]
}
```
- `iss` (issuer) : qui a émis le jeton
- `sub` (subject) : pour qui il a été émis
- `iat` (issued at) et `exp` (expiration) : des timestamps en secondes
- `roles` : un claim à nous, on peut en ajouter autant qu'on veut

Le troisième morceau, la signature, est calculé à partir du header, du payload et d'une clé que seul le serveur connaît.

NB : **un JWT n'est pas chiffré**. Base64, ce n'est pas du chiffrement, c'est juste un encodage. Colle n'importe quel JWT sur jwt.io et tu lis tout le payload en clair. Donc jamais de mot de passe, de numéro de carte ou de donnée sensible dedans.

## Alors à quoi sert la signature ?
Elle ne cache rien, elle **empêche de modifier**. Si quelqu'un récupère son jeton et remplace `"roles": ["ROLE_USER"]` par `"roles": ["ROLE_ADMIN"]`, la signature ne correspond plus au contenu. Le serveur recalcule la signature avec sa clé, voit que ça ne colle pas, et rejette le jeton. Pour fabriquer une signature valide, il faudrait la clé secrète.

Deux familles d'algorithmes :
- **HS256** (HMAC) : une seule clé secrète, qui sert à signer et à vérifier. Simple, parfait quand c'est la même appli qui émet et vérifie les jetons.
- **RS256** (RSA) : une clé privée pour signer, une clé publique pour vérifier. Utile quand plusieurs services doivent vérifier des jetons émis par un serveur d'authentification central (Keycloak, Auth0…) : ils n'ont besoin que de la clé publique.

Ici, on part sur HS256 : une appli Spring Boot qui fait tout.

## Le parcours complet
1. Le client envoie son login et son mot de passe à `POST /api/auth/login`
2. Le serveur vérifie les identifiants, fabrique un JWT signé et le renvoie
3. Le client garde le jeton
4. À chaque requête, il l'envoie dans `Authorization: Bearer <jeton>`
5. Le serveur vérifie la signature et la date d'expiration, et sait qui parle

## Mise en place avec Spring Security
Bonne nouvelle : pas besoin d'écrire un filtre maison qui découpe le header à la main, comme on le voit dans beaucoup de tutos. Spring Security sait déjà vérifier des JWT avec son module **OAuth2 Resource Server**, et il fournit aussi de quoi les générer.

### Étape 1 — Les dépendances
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-oauth2-resource-server</artifactId>
</dependency>
```
Le second embarque la librairie Nimbus, qui fait le vrai travail de signature et de vérification.

### Étape 2 — La clé secrète
Dans application.yml :
```yaml
jwt:
  secret: ${JWT_SECRET}
```
La valeur vient d'une variable d'environnement, jamais du code ni de Git. Avec HS256, la clé doit faire **au moins 256 bits, soit 32 caractères**. Plus courte, et Nimbus refuse de signer. Pour en générer une :
```bash
openssl rand -base64 32
```

### Étape 3 — La configuration de sécurité
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${jwt.secret}")
    private String secret;

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/login").permitAll()
                .anyRequest().authenticated())
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));
        return http.build();
    }

    @Bean
    SecretKey jwtSecretKey() {
        return new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
    }

    @Bean
    JwtEncoder jwtEncoder(SecretKey jwtSecretKey) {
        return new NimbusJwtEncoder(new ImmutableSecret<>(jwtSecretKey));
    }

    @Bean
    JwtDecoder jwtDecoder(SecretKey jwtSecretKey) {
        return NimbusJwtDecoder.withSecretKey(jwtSecretKey).build();
    }

    @Bean
    JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter authorities = new JwtGrantedAuthoritiesConverter();
        authorities.setAuthoritiesClaimName("roles");
        authorities.setAuthorityPrefix("");
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(authorities);
        return converter;
    }

    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```
Ce qui se passe ligne par ligne :
- `STATELESS` : Spring ne crée plus de session HTTP. Chaque requête doit apporter son jeton.
- `csrf.disable()` : la protection CSRF sert contre les attaques qui exploitent les cookies envoyés automatiquement par le navigateur. Ici, le jeton voyage dans un header que le navigateur n'ajoute jamais tout seul, donc on peut la couper. Si un jour tu mets ton jeton dans un cookie, il faut la remettre.
- `oauth2ResourceServer(...jwt(...))` : c'est la ligne qui fait tout. Spring lit le header `Authorization: Bearer`, passe le jeton au `JwtDecoder`, vérifie la signature et l'expiration, et remplit le contexte de sécurité. Jeton absent, faux ou expiré : réponse 401.
- `JwtAuthenticationConverter` : par défaut, Spring cherche les droits dans un claim `scope` et leur ajoute le préfixe `SCOPE_`. On lui dit plutôt de lire notre claim `roles`, tel quel. Comme ça, `hasRole("ADMIN")` fonctionne normalement.

Pour l'exemple, des utilisateurs en mémoire. Dans un vrai projet, ton `UserDetailsService` irait les chercher en base avec JPA :
```java
@Bean
UserDetailsService users(PasswordEncoder encoder) {
    return new InMemoryUserDetailsManager(
        User.withUsername("fallou")
            .password(encoder.encode("motdepasse"))
            .roles("USER")
            .build());
}
```

### Étape 4 — Fabriquer le jeton
```java
@Service
public class TokenService {

    private final JwtEncoder encoder;

    public TokenService(JwtEncoder encoder) {
        this.encoder = encoder;
    }

    public String generate(Authentication authentication) {
        Instant now = Instant.now();
        List<String> roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("conso-linky")
                .subject(authentication.getName())
                .issuedAt(now)
                .expiresAt(now.plus(15, ChronoUnit.MINUTES))
                .claim("roles", roles)
                .build();

        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
        return encoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
    }
}
```
Le `JwsHeader` avec `HS256` est important : sans lui, l'encodeur part du principe que tu signes en RS256, ne trouve pas de clé RSA, et plante avec un message pas très parlant (*"Failed to select a JWK signing key"*).

### Étape 5 — L'endpoint de login
```java
public record LoginRequest(String username, String password) {}

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;

    public AuthController(AuthenticationManager authenticationManager, TokenService tokenService) {
        this.authenticationManager = authenticationManager;
        this.tokenService = tokenService;
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password()));
        return Map.of("token", tokenService.generate(authentication));
    }
}
```
`authenticate` vérifie le mot de passe avec ton `UserDetailsService` et le `PasswordEncoder`. Mauvais identifiants : il lève une exception, Spring Security répond 401, et on ne fabrique jamais de jeton.

### Étape 6 — Tester
On récupère un jeton :
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"fallou","password":"motdepasse"}'

{"token":"eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJjb25zby1saW5reSIs..."}
```
Et on l'utilise :
```bash
curl http://localhost:8080/api/mesures \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJjb25zby1saW5reSIs..."
```
Sans le header, ou avec un jeton modifié d'un seul caractère : 401.

Dans un contrôleur, tu récupères l'utilisateur courant directement depuis le jeton :
```java
@GetMapping("/api/moi")
public String moi(@AuthenticationPrincipal Jwt jwt) {
    return "Connecté en tant que " + jwt.getSubject();
}
```

## Où stocker le jeton côté front ?
C'est la question qui fait débat, et il n'y a pas de réponse parfaite :
- **localStorage** : le plus simple, mais n'importe quel script de la page peut le lire. Si ton site a une faille XSS, le jeton est volé.
- **En mémoire** (une variable JavaScript) : impossible à lire depuis un autre script persistant, mais perdu à chaque rechargement de page.
- **Cookie HttpOnly** : inaccessible au JavaScript, donc protégé du XSS. Mais le navigateur l'envoie tout seul, donc il faut remettre la protection CSRF, et gérer les cookies cross-origin (`credentials: "include"`, voir l'article CORS).

Le compromis le plus répandu : un **access token** court (15 minutes), gardé en mémoire, et un **refresh token** plus long dans un cookie HttpOnly, qui sert uniquement à obtenir un nouvel access token quand l'ancien expire.

## Les pièges classiques
**On ne peut pas révoquer un JWT.** Le serveur ne retient rien, donc il ne peut pas "déconnecter" un jeton déjà émis : il reste valable jusqu'à son `exp`. C'est pour ça qu'on garde des durées courtes. Si tu as vraiment besoin de révoquer (compte bloqué, mot de passe changé), il faut une liste noire côté serveur… et tu perds une partie de l'intérêt du stateless.

**La déconnexion, c'est le client qui oublie le jeton.** Côté serveur, il n'y a rien à faire, et rien qu'on puisse faire.

**Ne vérifie jamais un JWT à la main.** Découper la chaîne et décoder le payload, ça ne vérifie rien. Il y a eu des failles célèbres avec des jetons à `"alg": "none"` acceptés sans signature. Laisse `NimbusJwtDecoder` faire : il vérifie la signature, l'algorithme et l'expiration.

**La clé dans Git.** Quiconque a ta clé HS256 peut fabriquer des jetons admin valides. Variable d'environnement ou gestionnaire de secrets, rien d'autre.

**L'horloge.** `exp` est comparé à l'heure du serveur. Spring tolère par défaut 60 secondes d'écart, mais si les machines ont plusieurs minutes de décalage, des jetons tout neufs seront refusés.

**Trop de choses dans le payload.** Le jeton est renvoyé à chaque requête : avec la liste complète des permissions et le profil de l'utilisateur dedans, tu alourdis tous tes appels. Garde l'identité et les rôles, le reste va en base.

## Pour résumer
- Un JWT = header + payload + signature, encodés en Base64URL
- Il n'est **pas chiffré** : tout le monde peut lire le payload
- La signature empêche de le modifier sans la clé secrète
- Avec Spring Security, `oauth2ResourceServer().jwt()` vérifie les jetons pour toi, pas besoin de filtre maison
- `JwtEncoder` + `JwsHeader` en HS256 pour les fabriquer
- Clé d'au moins 32 caractères, hors du code
- Jetons courts, car on ne peut pas les révoquer

Le JWT n'est pas magique : c'est juste un moyen de transporter l'identité de l'utilisateur sans que le serveur ait besoin de s'en souvenir. Bien utilisé, il simplifie énormément une API. Mal utilisé (payload sensible, durée de vie d'un an, clé dans le code), il devient une faille.
