Dicionário de Dados — Sistema de Gestão Operacional (Localiza Rent a Car)

Portal web interativo de documentação de metadados e governança de dados. O projeto documenta a modelagem relacional em MySQL do domínio operacional de locação de veículos da Localiza Rent a Car, abrangendo processos de reservas, locações, contratos, gestão de frota, filiais, manutenções, multas e faturamento.

🎯 Sobre o Projeto

A documentação técnica de bancos de dados muitas vezes fica isolada em documentos estáticos de difícil consulta. Este portal resolve esse problema oferecendo uma interface navegável e estruturada para analistas de dados, desenvolvedores, auditores e gestores consultarem definições de tabelas, regras de negócio, linhagem de dados e políticas de privacidade em um só lugar.

✨ Principais Funcionalidades

Catálogo Interativo de Metadados: Consulta rápida de entidades, atributos, tipos de dados (MySQL), nulabilidade, valores padrão, chaves primárias (PK), chaves estrangeiras (FK) e restrições de integridade.

Diagrama Entidade-Relacionamento (DER) Navegável: Visualização interativa do modelo relacional (assets/der.png) com suporte a zoom e arraste (pan) via Panzoom.js.

Rastreabilidade e Linhagem: Mapeamento da origem, transformação e fluxo dos dados entre os processos operacionais.

Especificação de Requisitos e Regras de Negócio: Documentação formal disponível em PDF diretamente no repositório para consulta aprofundada.

🛡️ Governança e Conformidade

A arquitetura de documentação foi construída com base nas melhores práticas de mercado e requisitos regulatórios:

Frameworks de Referência: Alinhamento aos princípios do DAMA-DMBOK (Gestão de Metadados, Qualidade e Segurança de Dados) e COBIT (Governança e Controles de TI).

Conformidade Legal (LGPD & CDC): Classificação explícita de privacidade em nível de atributo e adequação às normas do Código de Defesa do Consumidor:

[DPS] — Dado Pessoal Sensível (exige controle rigoroso e base legal específica).

[DP] — Dado Pessoal (identifica ou torna identificável uma pessoa natural).

[N/A] — Não Aplicável (dados corporativos, operacionais ou de frota sem vínculo pessoal direto).

Controle de Acesso (RBAC): Definição de matriz Role-Based Access Control detalhando permissões de leitura, escrita e auditoria por perfil operacional.

📁 Estrutura do Repositório

dicionario_dados_localiza/
├── assets/
│   └── der.png                                          # Diagrama Entidade-Relacionamento (DER)
├── docs/
│   └── Especificacao_Requisitos_Regras_Negocio_BD.pdf   # Documento de requisitos e regras de negócio
├── index.html                                           # Estrutura principal do portal web
├── style.css                                            # Estilização e layout responsivo
├── script.js                                            # Lógica de busca, filtros e controle do Panzoom
└── README.md                                            # Documentação do repositório


🛠️ Tecnologias Utilizadas

Front-end: HTML5, CSS3 e JavaScript (Vanilla)

Visualização Gráfica: Panzoom.js

SGBD Documentado: MySQL

Hospedagem Estática: GitHub Pages

💻 Como Executar Localmente

Por ser uma aplicação estática, não há necessidade de instalação de dependências ou servidores complexos:

Clone este repositório:

git clone https://github.com/seu-usuario/dicionario_dados_localiza.git


Acesse a pasta do projeto:

cd dicionario_dados_localiza


Abra o arquivo index.html diretamente no seu navegador de preferência ou utilize uma extensão como o Live Server no VS Code.

🌐 Publicação no GitHub Pages

Para disponibilizar o portal online gratuitamente:

No seu repositório no GitHub, acesse Settings (Configurações) > Pages.

Em Build and deployment, selecione Deploy from a branch.

Escolha a branch main (ou master) e a pasta / (root), depois clique em Save.

Aguarde alguns instantes e acesse o link gerado pelo GitHub Pages.

👥 Equipe e Orientação

Autores:

Gustavo Ferreira R. Pimentel

Gabriel da Conceição

Dania Huito Choque

Orientação:

Prof. Dr. Diego Carvalho
