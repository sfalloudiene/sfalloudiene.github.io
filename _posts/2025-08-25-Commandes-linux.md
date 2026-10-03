---
title: Commandes Linux
tags: Linux
newsletter: false
cover: https://images.unsplash.com/photo-1588589178076-5b18af45f90b?q=80&w=873&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
image: https://images.unsplash.com/photo-1588589178076-5b18af45f90b?q=80&w=873&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
article_header:
  type: overlay
  theme: dark
  background_color: '#123'
  background_image: 
    src: https://images.unsplash.com/photo-1588589178076-5b18af45f90b?q=80&w=873&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
---

Résumé de quelques Commandes Linux

<!--more-->

## Navigation dans le système de fichiers

| `pwd` | Affiche le répertoire de travail actuel |
| --- | --- |
| `ls` | Liste le contenu d'un répertoire |
| `ls -l` | Liste détaillée avec permissions et tailles |
| `ls -a` | Liste tous les fichiers (y compris cachés) |
| `cd [dossier]` | Change de répertoire |
| `cd ..` | Remonte d'un niveau |
| `cd ~` | Accède au répertoire personnel |

## Manipulation de fichiers

| `touch [fichier]` | Crée un fichier vide |
| --- | --- |
| `mkdir [dossier]` | Crée un répertoire |
| `cp [source] [dest]` | Copie un fichier ou dossier |
| `mv [source] [dest]` | Déplace ou renomme un fichier |
| `rm [fichier]` | Supprime un fichier |
| `rm -r [dossier]` | Supprime un dossier et son contenu |
| `rmdir [dossier]` | Supprime un dossier vide |

## Affichage du contenu des fichiers

| `cat [fichier]` | Affiche tout le contenu d'un fichier |
| --- | --- |
| `less [fichier]` | Affiche le contenu page par page |
| `head [fichier]` | Affiche les 10 premières lignes |
| `tail [fichier]` | Affiche les 10 dernières lignes |
| `grep [motif] [fichier]` | Recherche un motif dans un fichier |

## Gestion des droits

| `chmod [options] [fichier]` | Modifie les permissions d'un fichier |
| --- | --- |
| `chown [utilisateur]:[groupe] [fichier]` | Change le propriétaire d'un fichier |
| `sudo [commande]` | Exécute une commande en tant qu'administrateur |

## Processus

| `ps` | Affiche les processus en cours |
| --- | --- |
| `ps aux` | Affiche tous les processus détaillés |
| `top` | Affiche les processus en temps réel |
| `kill [PID]` | Termine un processus |
| `killall [nom]` | Termine tous les processus du nom spécifié |

## Réseau

| `ifconfig` | Affiche la configuration réseau |
| --- | --- |
| `ip a` | Alternative moderne à ifconfig |
| `ping [hôte]` | Vérifie la connectivité avec un hôte |
| `ssh [utilisateur]@[hôte]` | Se connecte à distance via SSH |
| `wget [URL]` | Télécharge un fichier depuis le web |
| `curl [URL]` | Transfère des données depuis/vers un serveur |

## Gestion des paquets (Debian/Ubuntu)

| `apt update` | Met à jour la liste des paquets |
| --- | --- |
| `apt upgrade` | Met à jour tous les paquets installés |
| `apt install [paquet]` | Installe un paquet |
| `apt remove [paquet]` | Supprime un paquet |
| `apt search [terme]` | Recherche un paquet |

## Compression et archivage

| `tar -cvf [archive.tar] [fichiers]` | Crée une archive tar |
| --- | --- |
| `tar -xvf [archive.tar]` | Extrait une archive tar |
| `tar -czvf [archive.tar.gz] [fichiers]` | Crée une archive compressée |
| `tar -xzvf [archive.tar.gz]` | Extrait une archive compressée |
| `zip -r [archive.zip] [dossier]` | Crée une archive zip |
| `unzip [archive.zip]` | Extrait une archive zip |

## Informations système

| `uname -a` | Affiche les informations du système |
| --- | --- |
| `df -h` | Affiche l'espace disque utilisé |
| `free -h` | Affiche l'utilisation de la mémoire |
| `lscpu` | Affiche les informations du processeur |
| `lsusb` | Liste les périphériques USB |
| `lspci` | Liste les périphériques PCI |

## Utilitaires divers

| `date` | Affiche la date et l'heure |
| --- | --- |
| `cal` | Affiche un calendrier |
| `history` | Affiche l'historique des commandes |
| `find [dossier] -name [motif]` | Recherche des fichiers |
| `which [commande]` | Localise une commande |
| `man [commande]` | Affiche le manuel d'une commande |
