---
title: Les classes abstraites en Java
tags: [Java]
cover: https://images.unsplash.com/photo-1758061317613-801801f1f4e6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
image: https://images.unsplash.com/photo-1758061317613-801801f1f4e6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
article_header:
  type: overlay
  theme: dark
  background_color: '#123'
  background_image:
    src: https://images.unsplash.com/photo-1758061317613-801801f1f4e6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
---

Les classes abstraites en Java sont des classes qui ne peuvent pas être instanciées directement, mais qui servent de modèle de base pour d'autres classes (appelées sous-classes ou classes concrètes). Elles sont déclarées avec le mot-clé abstract.

<!--more-->

## Caractéristiques Clés

- **Non-instanciables** : On ne peut pas créer d'objets directement à partir d'une classe abstraite. Elle est trop générique pour exister seule.
- **Héritage obligatoire** : Pour être utilisées, elles doivent être **étendues** par des classes concrètes (non-abstraites).
- **Méthodes abstraites** : Elles peuvent contenir des **méthodes abstraites** (déclarées avec `abstract` et sans corps de méthode). Ces méthodes agissent comme un **contrat** : toute sous-classe concrète doit obligatoirement les implémenter (fournir un corps de méthode).
- **Contenu Mixte** : Elles peuvent également contenir :
    - Des **méthodes concrètes** (méthodes normales avec un corps, réutilisables par les sous-classes).
    - Des **variables d'instance** et **statiques**.
    - Des **constructeurs** (qui sont appelés lors de l'instanciation des sous-classes).

## Exemple de Classe Abstraite

Imaginons que nous voulons modéliser différents types d'animaux. Le concept d'un "Animal" générique est trop vague pour être instancié directement.

```java
// Déclaration de la classe abstraite avec le mot-clé 'abstract'
abstract class Animal {
    String nom;

    // Constructeur (peut être appelé par les sous-classes via 'super()')
    public Animal(String nom) {
        this.nom = nom;
    }

    // Méthode abstraite : pas de corps (seulement la signature). 
    // Oblige les sous-classes à définir comment l'animal émet un son.
    public abstract void emettreSon();

    // Méthode concrète : a un corps et est héritée telle quelle.
    public void dormir() {
        System.out.println(this.nom + " dort paisiblement.");
    }
}
```

## Exemples de Sous-Classes Concrètes

Les sous-classes héritent de `Animal` et doivent fournir l'implémentation de la méthode abstraite `emettreSon()`.

### 1. Classe `Chien`

```java
// La classe concrète 'Chien' étend 'Animal'
class Chien extends Animal {
    public Chien(String nom) {
        super(nom); // Appel du constructeur de la classe abstraite
    }

    // Implémentation OBLIGATOIRE de la méthode abstraite
    @Override
    public void emettreSon() {
        System.out.println(this.nom + " aboie : Wouaf !");
    }
}
```

### 2. Classe `Chat`

```java
class Chat extends Animal {
    public Chat(String nom) {
        super(nom);
    }

    // Implémentation OBLIGATOIRE de la méthode abstraite
    @Override
    public void emettreSon() {
        System.out.println(this.nom + " miaule : Miaou !");
    }
}
```

## Utilisation

```java
public class TestAbstraction {
    public static void main(String[] args) {
        // Animal a = new Animal("Générique"); // ERREUR : Ne peut pas instancier une classe abstraite

        Chien milou = new Chien("Milou");
        Chat garfield = new Chat("Garfield");

        milou.emettreSon(); // Sortie : Milou aboie : Wouaf !
        milou.dormir();    // Sortie : Milou dort paisiblement.

        garfield.emettreSon(); // Sortie : Garfield miaule : Miaou !
        garfield.dormir();     // Sortie : Garfield dort paisiblement.
    }
}
```

Les classes abstraites sont donc utilisées pour **définir une structure commune** et **forcer l'implémentation de comportements spécifiques** (méthodes abstraites) dans les classes dérivées.
