# Repository Structure

Recommended final repository:

``` text
railway-tatkal/
├── README.md
├── LICENSE
├── .gitignore
├── docker-compose.yml
├── pom.xml
│
├── docs/
│   ├── 01-product-requirements.md
│   ├── 02-software-requirements-specification.md
│   ├── 03-domain-model.md
│   ├── 04-api-contract.md
│   ├── 05-database-design.md
│   ├── 06-architecture.md
│   ├── 07-concurrency-and-tatkal-design.md
│   ├── 08-payment-and-failure-model.md
│   ├── 09-security.md
│   ├── 10-testing-strategy.md
│   ├── 11-observability.md
│   ├── 12-adr.md
│   ├── 13-roadmap.md
│   └── 14-repository-structure.md
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   └── resources/
│   └── test/
│       ├── java/
│       └── resources/
│
├── db/
│   └── migrations/
│
├── scripts/
│
└── frontend/
```

## Backend Package Direction

Prefer domain-oriented packages over one giant global package:

``` text
com.example.railway
├── auth
├── user
├── train
├── inventory
├── booking
├── payment
├── ticket
├── common
└── config
```

The exact package names can change.

## Rule

Do not create packages for infrastructure that does not yet exist.

For example, do not create Kafka consumers in Stage 1 merely because
Kafka is planned for Stage 6.
