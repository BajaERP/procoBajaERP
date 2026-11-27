# Triagem local e status no Projects

As skills que escrevem em `.scratch/` usam os estados abaixo na linha `Status:` dos arquivos locais.

| Estado | Significado |
| --- | --- |
| `needs-triage` | A issue precisa ser avaliada. |
| `needs-info` | A issue aguarda informações de quem a abriu. |
| `ready-for-agent` | A issue está especificada e pronta para um agente trabalhar de forma autônoma. |
| `ready-for-human` | A implementação precisa ser feita por uma pessoa. |
| `wontfix` | A issue não será atendida. |

Use `Status: blocked` quando uma entrega posterior depende de uma entrega indisponível de outro módulo. Em `Blocked by:`, identifique o pré-requisito e vincule a issue correspondente. Quando o pré-requisito estiver disponível, atualize a triagem conforme a prontidão da issue.

No [Projects procoBajaERP](https://github.com/orgs/BajaERP/projects/2), use o campo **Status** para o andamento compartilhado. O quadro oferece **Backlog**, **Ready**, **In progress**, **In review** e **Done**. A descrição da issue publicada deve explicar a entrega e os bloqueios com links diretos e omitir a linha de triagem local.

Os estados de execução do Wayfinding são específicos desse fluxo; consulte [issue-tracker.md](issue-tracker.md).
