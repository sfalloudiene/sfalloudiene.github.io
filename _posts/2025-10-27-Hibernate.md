---
title: Hibernate
tags: [Hibernate, Java]
newsletter: false
cover: https://images.unsplash.com/photo-1493397212122-2b85dda8106b?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
image: https://images.unsplash.com/photo-1493397212122-2b85dda8106b?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
article_header:
  type: overlay
  theme: dark
  background_color: '#123'
  background_image:
    src: https://images.unsplash.com/photo-1493397212122-2b85dda8106b?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
---

Hibernate est un **framework ORM (Object-Relational Mapping)** pour Java.

<!--more-->

Son rôle principal est de faire le **pont entre vos objets Java** (comme votre classe `Voiture`) et les **tables de la base de données** (MySQL ou autre).

### À quoi sert Hibernate ?

- **Simplifier l'accès aux données :** Il vous permet de manipuler les données de la base de données en utilisant des objets Java et des méthodes simples (ex : `dao.ajouter(voiture)`) au lieu d'écrire du code SQL complexe et répétitif.
- **Implémenter JPA :** Hibernate est l'une des implémentations les plus populaires de la **spécification JPA (Java Persistence API)**.
- **Portabilité :** Il gère les différences de dialecte entre les bases de données (MySQL, Oracle, PostgreSQL, etc.), rendant votre code plus portable.

En résumé, il vous permet de **penser en objets** (programmation orientée objet) pendant qu'il se charge de la **traduction en SQL** (base de données relationnelle) en arrière-plan.

## Les Annotations JPA (Java Persistence API)

```java
@Entity
@Table(name = "personne") // optionnel car par défaut
public class Personne {
@Id //identifiant
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;
@Column(name = "nom",unique = true, nullable = false,length = 30)
private String nom;
private String prenom; //correspond par défaut à la colonne prenom
@ColumnDefault("20000") //valeur par défaut
private Integer salaire;
```

Les annotations JPA sont des marqueurs que vous placez sur vos classes et attributs Java pour indiquer à un fournisseur de persistance (comme Hibernate) comment mapper ces éléments à une table et des colonnes dans une base de données.

### Annotations au niveau de la Classe

| **Annotation** | **Explication** | **Exemple dans le code** |
| --- | --- | --- |
| **`@Entity`** | **Obligatoire.** Marque une classe Java comme une **entité persistante**. Chaque instance de cette classe est un enregistrement dans une table de la base de données. | `@Entity` |
| **`@Table`** | **Optionnelle.** Spécifie le **nom de la table** dans la base de données à laquelle cette entité est mappée. Si elle est omise, le nom de la table est le nom de la classe (`Voiture` devient la table `Voiture`). | `@Table(name = "personne")` |

### Annotations au niveau de l'Identifiant (Clé Primaire)

| **Annotation** | **Explication** | **Exemple dans le code** |
| --- | --- | --- |
| **`@Id`** | **Obligatoire.** Marque l'attribut comme la **clé primaire** (Primary Key). C'est le champ unique qui identifie chaque enregistrement. | `@Id` |
| **`@GeneratedValue`** | Indique que la valeur de la clé primaire est **générée automatiquement**. | `@GeneratedValue(...)` |
| **`strategy = GenerationType.IDENTITY`** | Spécifie la méthode de génération. `IDENTITY` indique que la base de données (ex: MySQL) gère l'**auto-incrémentation** de la valeur. | `strategy = GenerationType.IDENTITY` |

### Annotations au niveau des Attributs (Colonnes)

| **Annotation** | **Explication** | **Exemple dans le code** |
| --- | --- | --- |
| **`@Column`** | **Optionnelle.** Permet de configurer les propriétés de la colonne associée à l'attribut. Si elle est omise, le nom de la colonne est celui de l'attribut (`prenom` devient la colonne `prenom`). | `@Column(...)` |
| **`name = "nom"`** | Définit le nom exact de la colonne dans la BDD. | `name = "nom"` |
| **`unique = true`** | Ajoute une contrainte d'unicité sur cette colonne. Deux enregistrements ne peuvent pas avoir la même valeur. | `unique = true` |
| **`nullable = false`** | Ajoute une contrainte `NOT NULL`. La colonne doit obligatoirement avoir une valeur lors de l'insertion. | `nullable = false` |
| **`length = 30`** | Définit la taille maximale (la longueur) du champ, utile pour les chaînes de caractères (`VARCHAR`). | `length = 30` |
| **`@ColumnDefault("20000")`** | Définit la **valeur par défaut** que la colonne prendra dans la base de données si aucune valeur n'est fournie lors de l'insertion. | `@ColumnDefault("20000")` |

## L’entité JPA (Notre classe)

Pour créer une entité JPA (**Java Persistence API**), on met le tag @Entity  en haut de notre classe. 

```jsx
package fr.esigelec.garage.dto;

import jakarta.persistence.*;

/**
 * @author Serigne Fallou DIENE
 */

@Entity 
public class Voiture {

    @Id // Qui est ici notre clé primaire
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Pour l'auto-incrémentation de l'id
    private Long id;
    private String immatriculation;
    private String modele;
    private int nbKm;
    
     public Voiture() {
    }

    public Voiture(String immatriculation, String modele, int nbKm) {
        this.immatriculation = immatriculation;
        this.modele = modele;
        this.nbKm = nbKm;
    }
```

Les deux premières lignes de la classe travaillent ensemble pour définir la colonne `id` comme la clé primaire unique de la table `Voiture` et déléguer la gestion de son incrémentation à la base de données.

On a besoin d'un **constructeur vide** (sans arguments) dans une entité JPA/Hibernate pour permettre au mécanisme de persistance (Hibernate) de créer une **nouvelle instance** de votre objet `Voiture` lorsqu'il charge des données depuis la base de données.

En d'autres termes, Hibernate a besoin de cette méthode simple pour **construire l'objet avant d'y injecter les valeurs** des colonnes (ID, immatriculation, etc.) lues dans la base de données. Sans lui, l'objet ne peut pas être créé, et l'opération échoue.

## Notre DAO

Le DAO d’une classe JPA se definit comme suit : 

```java
package fr.esigelec.garage.dao;

import fr.esigelec.garage.dto.Voiture;
import jakarta.persistence.*;
import java.util.List;

/**
 * @author Serigne Fallou DIENE
 */

public class VoitureDAO {

	private static final EntityManagerFactory emf;

	static {
		try {
			// Utilise le nom de l'unité de persistance défini dans persistence.xml
			emf = Persistence.createEntityManagerFactory("monPersistenceUnit");
		} catch (Throwable ex) {
			System.err.println("Initial EntityManagerFactory creation failed." + ex);
			throw new ExceptionInInitializerError(ex);
		}
	}

	public void ajouter(Voiture v) {
		try (EntityManager em = emf.createEntityManager()) {

			em.getTransaction().begin(); // Début de la transaction

			try {
				em.persist(v);
				em.getTransaction().commit();
			} catch (Exception e) {
				// Si la transaction est toujours active, on annule (rollback)
				if (em.getTransaction().isActive()) {
					em.getTransaction().rollback();
				}
				throw e; // On remonte l'Exeption
			}
		}
	}
```

La ligne `private static final EntityManagerFactory emf;` dans la classe `VoitureDAO` sert à initialiser et à stocker l'objet **`EntityManagerFactory` (EMF)**, qui est essentiel pour interagir avec la base de données en utilisant JPA.

En termes simples, c'est l'**usine principale** qui prépare l'environnement de persistance.

## Rôle de l'`EntityManagerFactory`

L'EntityManagerFactory est une ressource coûteuse à créer. Elle est responsable de :

- **Charger la configuration JPA** (à partir du fichier persistence.xml).
- **Initialiser le fournisseur de persistance** (Hibernate).
- **Créer le pool de connexions** à la base de données.

```java
static {
		try {
			// Utilise le nom de l'unité de persistance défini dans persistence.xml
			emf = Persistence.createEntityManagerFactory("monPersistenceUnit");
		} catch (Throwable ex) {
			System.err.println("Initial EntityManagerFactory creation failed." + ex);
			throw new ExceptionInInitializerError(ex);
		}
	}
```

## Explication du Bloc d'Initialisation Statique

### 1. Le Rôle du Bloc Statique

Le mot-clé static indique que ce bloc de code sera exécuté une seule et unique fois par la machine virtuelle Java (JVM) au moment où la classe VoitureDAO est chargée en mémoire.

- **Objectif :** Initialiser la variable statique emf (l'EntityManagerFactory). L'EMF est une ressource très coûteuse à créer, il est donc crucial de ne le faire qu'une seule fois au démarrage de l'application, et non à chaque appel de méthode du DAO.

### 2. L'Initialisation de l'EntityManagerFactory

La ligne clé est :

`emf = Persistence.createEntityManagerFactory("monPersistenceUnit");`

- **`Persistence.createEntityManagerFactory(...)`** : C'est la méthode standard JPA qui demande au système de persistance (Hibernate) de lire le fichier de configuration (`persistence.xml`) et de construire l'usine d'entités.
- **`"monPersistenceUnit"`** : C'est le nom de l'unité de persistance que vous avez défini dans votre fichier `persistence.xml`. C'est l'identifiant qui permet à JPA de savoir quelle configuration (quelle base de données, quelles classes, quels paramètres) utiliser.

```xml
<persistence xmlns="https://jakarta.ee/xml/ns/persistence"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="https://jakarta.ee/xml/ns/persistence https://jakarta.ee/xml/ns/persistence/persistence_3_2.xsd"
	version="3.2">
	<persistence-unit name="monPersistenceUnit">
		<class>fr.esigelec.garage.dto.Voiture</class> 
		<properties>
			<property name="jakarta.persistence.jdbc.driver"
				value="com.mysql.cj.jdbc.Driver" />
			<property name="jakarta.persistence.jdbc.url"
				value="jdbc:mysql://localhost:3306/annuaire" />
			<property name="jakarta.persistence.jdbc.user" value="root" />
			<property name="jakarta.persistence.jdbc.password" value="1234" />
			<property name="hibernate.dialect"
				value="org.hibernate.dialect.MySQLDialect" />
			<property name="hibernate.hbm2ddl.auto" value="update" />
			<property name="hibernate.show_sql" value="true" />
		</properties>
	</persistence-unit>
</persistence>
```

### 3. Gestion des Erreurs (Robustesse)

Le bloc est enveloppé dans une structure `try-catch` pour gérer tout problème survenant pendant la phase d'initialisation:

- **`catch (Throwable ex)`** : Si Hibernate ne trouve pas le pilote JDBC (comme vous l'avez vu avec `com.mysql.cj.jdbc.Driver`), ne parvient pas à lire le `persistence.xml`, ou rencontre une autre erreur grave, l'exécution passe au bloc `catch`.
- **`throw new ExceptionInInitializerError(ex)`** : Ceci est le mécanisme standard en Java pour signaler qu'une erreur irrécupérable s'est produite lors de la préparation statique de la classe. Il arrête le chargement de la classe et empêche l'application de continuer à s'exécuter dans un état non fonctionnel.

En résumé, ce bloc garantit que l'outil principal de communication avec la base de données (`emf`) est **créé correctement et une seule fois** avant que toute autre partie de la classe `VoitureDAO` ne soit utilisée.

## Explication Détaillée du Bloc `ajouter(Voiture v)`

```java
public void ajouter(Voiture v) {
		try (EntityManager em = emf.createEntityManager()) {

			em.getTransaction().begin(); // Début de la transaction

			try {
				em.persist(v);
				em.getTransaction().commit();
			} catch (Exception e) {
				// Si la transaction est toujours active, on annule (rollback)
				if (em.getTransaction().isActive()) {
					em.getTransaction().rollback();
				}
				throw e; // On remonte l'Exeption
			}
		}
	}
```

### 1. Ouverture de la Session de Travail (L'EntityManager)

`try (EntityManager em = emf.createEntityManager()) { ... }`

Cette ligne crée un nouvel **`EntityManager`** (`em`) à partir de l'`EntityManagerFactory` (`emf`). L'`EntityManager` est l'interface principale de JPA; il représente une session de travail avec la base de données.

- L'utilisation du `try-with-resources` (`try (...)`) garantit que l'`EntityManager` sera automatiquement fermé (`em.close()`) après l'exécution du bloc, qu'il y ait succès ou échec. Ceci est crucial pour libérer les ressources et éviter les fuites de mémoire.

### 2. Démarrage de la Transaction

`em.getTransaction().begin();`

La persistance modifie la base de données, elle doit donc être gérée par une **transaction**. Cette ligne marque le début d'une unité de travail. Si l'opération échoue, toutes les modifications faites à partir de ce point devront être annulées.

### 3. L'Opération de Persistance et la Validation

`try {
    em.persist(v);
    em.getTransaction().commit();
}`

C'est le bloc de code qui exécute l'action principale et garantit son achèvement :

- **`em.persist(v)`** : C'est l'instruction JPA qui ajoute l'objet `Voiture v` au contexte de persistance et prépare son insertion dans la base de données.
- **`em.getTransaction().commit()`** : Si `persist()` réussit, cette ligne **valide** la transaction. C'est l'étape qui envoie réellement la commande `INSERT INTO ...` à la base de données et rend les changements permanents.

### 4. Gestion des Erreurs et Annulation (Rollback)

`catch (Exception e) {
    if (em.getTransaction().isActive()) {
        em.getTransaction().rollback();
    }
    throw e;
}`

Ce bloc assure l'intégrité des données :

- **`catch (Exception e)`** : Si une erreur se produit (par exemple, une contrainte `NOT NULL` violée, ou une erreur de connexion), l'exécution passe ici.
- **`em.getTransaction().rollback()`** : Si la transaction est toujours en cours (`isActive()`), cette ligne **annule** toutes les modifications faites depuis le `begin()`. Ceci est l'essence de la sécurité transactionnelle; cela garantit que la base de données reste dans un état cohérent.
- **`throw e`** : L'exception est relancée (`remontée`). Cela permet au code appelant (par exemple, votre classe de test) de savoir que l'opération a échoué et de prendre des mesures appropriées.

## **Instructions JPA Essentielles**

| **Catégorie** | **Méthode/Annotation JPA** | **Contexte / Rôle** |
| --- | --- | --- |
| **I. Cycle de Vie** | `em.persist(entité)` | **Ajoute** (crée) une nouvelle entité dans le contexte de persistance, entraînant une commande `INSERT` lors du commit. |
|  | `em.find(Classe.class, id)` | **Recherche** (lit) et retourne l'entité par sa clé primaire (`ID`). |
|  | `em.merge(entité)` | **Met à jour** (update) ou attache une entité détachée au contexte de persistance. |
|  | `em.remove(entité)` | **Supprime** l'entité de la base de données. |
| **II. Transactions** | `em.getTransaction().begin()` | **Démarre** une unité de travail logique (transaction). |
|  | `em.getTransaction().commit()` | **Valide** les modifications et les rend permanentes en base de données. |
|  | `em.getTransaction().rollback()` | **Annule** toutes les modifications depuis le `begin()` en cas d'erreur. |
| **III. Mappage (Entité)** | `@Entity` | Marque la classe comme une **entité persistante**. |
|  | `@Id` | Marque l'attribut comme la **clé primaire** de la table. |
|  | `@GeneratedValue(...)` | Définit le mécanisme d'**auto-incrémentation** de la clé primaire. |
|  | `@Table(name="...")` | **Optionnel.** Spécifie le nom exact de la table en BDD. |
| **IV. Mappage (Attribut)** | `@Column(name="...")` | **Optionnel.** Spécifie le nom exact de la colonne en BDD. |
|  | `nullable = false` | Contrainte pour rendre la colonne **obligatoire** (NOT NULL). |
|  | `length = X` | Définit la **taille** maximale pour un champ de type `String` (VARCHAR). |
|  | `@Transient` | Indique que l'attribut **ne doit pas être persisté** dans la base de données. |

## Initialisation de l’entity manager

```java
EntityManagerFactory emf;
		try {
			emf = Persistence.createEntityManagerFactory("geographie_pu");
		} catch (Throwable ex) {
			System.err.println("Initial EntityManagerFactory creation failed." + ex);
			throw new ExceptionInInitializerError(ex);
		}
```

| **État** | **Définition** | **Comment y Arriver** |
| --- | --- | --- |
| **New (Nouveau)** | L'objet vient d'être instancié (`new Pays()`) et n'est pas encore associé à un `EntityManager`. | `new Ville(...)` |
| **Managed (Managé)** | L'objet est dans le contexte de persistance et est synchronisé avec la BDD. | `em.persist()`, `em.find()`, ou `em.merge()`. |
| **Detached (Détaché)** | L'objet a été managé, mais l'EntityManager qui l'a chargé a été fermé, ou la transaction a été terminée. | `em.close()`, `em.detach()`, ou `em.clear()`. |
| **Removed (Supprimé)** | L'objet est managé et a été marqué pour suppression par `em.remove()`. | `em.remove()` |
