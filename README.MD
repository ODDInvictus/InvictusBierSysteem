# Invictus Bier Systeem

Half-werkende beun oplossing voor een probleem dat niet bestond.

## Help! Ik dit lokaal draaien

Nou, dat kan! Enige vereiste is het draaien van een [appwrite](https://appwrite.io/) server. Dat kan makkelijk lokaal in docker, instructies staan wel op de appwrite website.

Daarna:
1. Clone de repository lokaal
`git clone git@github.com:ODDInvictus/InvictusBierSysteem.git`
4. Initializeer je Appwrite project in de appwrite console
2. Maak een .env in de root en backend map [(Zie puntje environment variables)](#Environment-Variables)
3. Installeer alle npm pakketten
`npm install`
5. Draai de frontend met
`npm run dev`
6. Draai de backend met
`cd backend && denon`

## Environment Variables

Beide de frontend en backend hebben een bestandje genaamd .env.example die je kan kopieren en .env noemen.
