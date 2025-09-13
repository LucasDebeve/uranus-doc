---
id: python-c-est-quoi
title: Python, c'est quoi ?
description: Comprendre ce qu'est Python
slug: /python-c-est-quoi
sidebar_position: 1
---

:::info

## 📈 Objectifs du cours

- **Définir** ce qu'est un langage de programmation
- **Définir** ce qu'est Python

:::

## A propos de Python

Python est un langage de programmation :
- développé depuis 1991
- interprété
- multi-paradigme
- typé dynamiquement
- à mémoire auto-gérée

En bref, Python est un langage de programmation idéal débuter la programmation car celui-ci est **simple**, **clair** et **efficace**.

---

## Mais alors, qu'est ce qu'un langage de programmation ?

Un langage de programmation est un langage qui formule des algorithmes et qui permet de créer des programmes.

Un programme est un ensemble de **instructions** qui vont **s'exécuter** pour **résoudre un problème**.

:::info

**Exemple :** un programme qui va **trouver le plus grand nombre** dans une liste de nombres.

:::

---

## La base de Python

### 📚 Quelques concepts

#### 📚 Variables

Les variables sont des espaces mémoire qui peuvent contenir des valeurs.

```python
# Déclaration d'une variable
nombre = 42
```

```python
# Déclaration d'une variable et affectation d'une valeur
nombre = 42
nombre = nombre + 1
```

#### 📚 Types de variables

Les variables peuvent être de **type différent**.

| Type | Description | Exemple |
| ---- | ----------- | ------- |
| `int` | entier | `42` |
| `float` | nombre décimal | `3.14` |
| `str` | chaîne de caractères | `"Hello"` |
| `bool` | booléen | `True` | 
| `None` | valeur par défaut | `None` |
| `tuple` | tuple | `(1, 2, 3, 3)` |
| `list` | liste | `[1, 2, 3, 3]` |
| `set` | ensemble | `{1, 2, 3}` |
| `dict` | dictionnaire | `{"name": "John", "age": 22}` |

```python
x = 1
print(x) # 1
print(type(x)) # <class 'int'>
```

#### 📚 Opérateurs

En Python, il existe plusieurs opérateurs :

| Opérateur | Description | Exemple |
| --------- | ----------- | ------- |
| `+` | addition | `1 + 1` |
| `-` | soustraction | `1 - 1` |
| `*` | multiplication | `1 * 1` |
| `/` | division | `1 / 1` |
| `%` | modulo | `10 % 3` |
| `**` | puissance | `2 ** 3` |
| `//` | division entière | `10 // 3` |

```python
x = 10
y = 2

print(x + y) # 12
print(x - y) # 8
print(x * y) # 20
print(x / y) # 5.0
print(x % y) # 0
print(x ** y) # 100
print(x // y) # 3
```

#### 📚 Conditions

Il peut arriver que certaines instructions doivent être exécutées selon que certaines conditions sont remplies.

Dans Python, on utilise les mots-clés `if`, `else` et `elif` pour cela.

```python
if age >= 18:
    print("Adulte")
else:
    print("Enfant")
```

Autre possibilité avec `elif` :

```python
if age >= 18:
    print("Adulte")
elif age >= 13:
    print("Adolescent")
else:
    print("Enfant")
```

#### 📚 Boucles

Dans un programme, il peut arriver que certaines instructions doivent être exécutées plusieurs fois.

La première solution est d'écrire plusieurs fois le même code mais cela peut vite devenir fastidieux. Par ailleurs, en terme de lisibilité, cela peut être difficile à comprendre.

Au lieu de cela, on peut utiliser des **boucles** pour répéter des instructions.

Il existe 2 types de boucles :

- les boucles `for` qui permettent de répéter des instructions pour tous les éléments d'une liste.
- les boucles `while` qui permettent de répéter des instructions tant qu'une condition est remplie.

```python
# Boucle for
for i in range(5):
    print(i)

# Boucle while
i = 0
while i < 5:
    print(i)
    i += 1
```

:::note
Ici on utilise la fonction `range()` pour créer une liste de nombres.

```python
>>> range(5)
[0, 1, 2, 3, 4]

>>> range(1, 6)
[1, 2, 3, 4, 5]

>>> range(1, 6, 2)
[1, 3, 5]
```
:::

#### 📚 Fonctions

Une fonction est un bloc de code qui peut être appelé plusieurs fois.

```python
def addition(x, y):
    return x + y

print(addition(2, 3)) # 5
```

Une fonction peut prendre des arguments et renvoyer des résultats.
Dans l'exemple ci-dessus, la fonction `addition()` prend deux arguments `x` et `y` et renvoie le résultat de l'addition de ces deux arguments.

:::note
En réalité, on a déjà travaillé avec des fonctions. Par exemple, la fonction `print()` qui permet d'afficher des informations sur l'écran.

```python
print("Hello") # Hello
```
:::

### Bonnes partiques

#### Typage

En Python, il est possible, pour plus de sécurité, de spécifier le type des arguments et des résultats d'une fonction.

```python
def addition(x: int, y: int) -> int:
    return x + y
```

#### Commentaires

Un commentaire est un texte qui est ignoré par le programme. Il peut être utilisé pour expliquer le code, ou pour indiquer des informations qui ne sont pas pertinentes pour le programme. On peut écire un commentaire en utilisant le symbole `#` ou en englobant le texte entre `"""`.

```python
# On affiche "Hello"
print("Hello")

""" On affiche "Hello"
On peut écrire plusieurs lignes
"""
print("Hello")
```

#### Documentation

Il est possible d'ajouter de la documentation grâce à des commentaires multilignes bien placés, c'est la `docstring`.

Pour documenter une fonction, il faut placer un commentaire au début de la fonction.

```python
def addition(x: int, y: int) -> int:
    """Ajoute deux nombres
    """
    return x + y
```

Pour détailler les arguments, il existe plusieurs syntaxes mais la plus simple est d'utiliser le format suivant :

```python
def addition(x: int, y: int) -> int:
    """Ajoute deux nombres
    
    :args x: premier élément de l'addition
    :args y: second élément de l'addition
    :return: le résultat de l'addition
    """
    return x + y
```

### Exercices

#### Exercice 1
Compléter la fonction suivante :

```python
def get_perimetre_circle(r: float) -> float:
    """Calcule le périmètre d'un cercle de rayon r

    :args r: rayon du cercle
    :return: le périmètre du cercle
    """
    pass
```

Le mot clé `pass` permet de passer l'exécution de la fonction jusqu'à la fin (ici, c'est pour éviter les erreurs de compilation). Lors de l'exercice, il faudra remplacer `pass` par votre code.


#### Exercice 2
Compléter la fonction suivante :

```python
def is_traingle_rectangle(a: float, b: float, c: float) -> bool:
    """Vérifie si un triangle est un rectangle, grâce au théorème de Pythagore

    :args a: longueur du côté A
    :args b: longueur du côté B
    :args c: longueur côté C
    :return: True si le triangle est un rectangle, False sinon
    """
    pass
```

#### Exercice 3
Compléter la fonction suivante :

```python
def get_imc(taille: int, poids: float) -> float:
    """Calcule le poids-indice de masse corporelle (IMC) d'un individu

    :args taille: taille du individu en centimètres
    :args poids: poids du individu en kg
    :return: l'IMC de l'individu
    """
    pass
```

#### Exercice 4
Compléter la fonction suivante :

```python
def get_montant_amende(vitesse: int, limite: int) -> float:
    """Calcule le montant de l'amende pour excès de vitesse à payer 

    :args vitesse: vitesse du véhicule en km/h
    :args limite: limite de vitesse autorisée en km/h
    :return: le montant de l'amende à payer
    """
    pass
```

Pour cet exercice, il faudra d'abord se renseigner sur le [calcul de l'amende pour excès de vitesse](https://www.securite-routiere.gouv.fr/reglementation-liee-aux-risques/reglementation-de-la-vitesse-au-volant).