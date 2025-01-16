# Korean Conjugation Drill

![Korean conjugation drill preview](./assets/preview.png)

A simple [website](https://korean-conjugation-drill.vercel.app/) designed to help you practice your Korean conjugations. 
Practice different formality levels, tenses, and grammar forms. Understand how 
each conjugation is formed from the dictionary form of a word.

- [Installation](#installation)
- [Integrations](#integrations)
- [Custom datasets](#custom-datasets)
- [Contributing](#contributing)

## Installation
1. Clone the repository.
    ```bash
    git clone https://github.com/brookjeynes/korean_conjugation_drill.git
    ```
2. Navigate into the project directory using your terminal.
    ```bash
    cd korean_conjugation_drill
    ```
3. Install the required packages.
    ```bash
    bun install
    ```
4. Run the web app.
    ```
    bun dev
    ```

## Integrations
- Use your own words exported from [Kimchi Reader](https://kimchi-reader.app/).

## Custom datasets
We currently only support the CSV file format that Kimchi Reader exports. You 
can however mock this youself by creating a CSV file with the following structure.

```
verb,0
verb,0
...
```

_Note: Your imported CSV file should not contain any headers_

## Contribution
Contributions, issues, and feature requests are always welcome!
