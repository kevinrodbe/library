# Rails API Course

This is the repo for the Rails API Course. Code examples can be found on the [BananaPodcast repository](https://github.com/codeschool/BananaPodcast).

## Prerequisites

* Rails For Zombies 1
* Rails For Zombies 2

## Table of Contents

1. [Route Constraints + Namespace](content/01-recap-intro.md) (complete)
2. [Resources and the GET method](content/02-resources-and-get.md) (pending HEADER)
3. [Content Negotiation](content/03-content-negotiation.md) (complete)
4. [POST, PUT/PATCH, DELETE](content/04-post-put-patch-delete.md) (in progress)
5. [Versioning](content/05-versioning.md) (complete)
6. [Authentication](content/06-authentication.md) (complete)

## Challenge App

Following the *Zombie Apocalypse Broadcast* theme, here's an idea for the app used for the challenges.

1. Get a list of infected humans. (**GET** to /infected_humans or /humans?status=infected)
2. For each human, find the medical kit they need. (we can follow **hyperlink** for medical kit)
3. Purchase the medical kit. (**POST** to /medical_kits/:id/purchase)
4. Apply medical kit to respective human. (**PATCH** /humans/:id)

* [The Lie of the API](http://ruben.verborgh.org/blog/2013/11/29/the-lie-of-the-api/)

## TODOs

* Mention status codes at the end of each level.


