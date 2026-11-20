Un buon modello semantico rispecchia lo **schema a stella**. Le relazioni definiscono come i filtri si propagano tra le tabelle: capirle bene evita numeri sbagliati.

## Elementi di una relazione

- **Cardinalità**: *uno-a-molti* (la più comune: una dimensione filtra molti fatti), *uno-a-uno*, *molti-a-molti*.
- **Direzione del filtro incrociato**: *singola* (dalla parte "uno" alla parte "molti") oppure *entrambe*.
- **Attiva / inattiva**: tra due tabelle può esserci una sola relazione attiva; le altre si attivano in una misura con `USERELATIONSHIP`.

## Dimensioni con ruoli multipli

Una tabella Vendite ha `DataOrdine` e `DataSpedizione`. Con una sola tabella Data:

```dax
Ricavo per data spedizione =
CALCULATE ( [Ricavo], USERELATIONSHIP ( Vendite[DataSpedizione], 'Data'[Data] ) )
```

In alternativa si creano **due tabelle data distinte** (ad esempio "Data ordine" e "Data spedizione"): più facile per gli utenti, ma il modello cresce.

## Relazioni molti-a-molti e tabelle bridge

Esempio: un conto corrente può avere più intestatari, e un cliente più conti. Non c'è una relazione uno-a-molti diretta tra **Cliente** e **Saldi**.

La soluzione classica è una **tabella bridge** (ponte):

```
Cliente 1 ── * ClienteConto * ── 1 Conto 1 ── * Saldi
```

- `ClienteConto` contiene le coppie (IdCliente, IdConto).
- Il filtro deve propagarsi da Cliente a Conto **attraverso** la bridge: la relazione tra `ClienteConto` e `Conto` deve filtrare **in entrambe le direzioni**, oppure si usa `CROSSFILTER` in una misura specifica.

> I totali con le relazioni molti-a-molti **non sono additivi**: un conto cointestato viene contato per ogni intestatario, ma nel totale generale compare una volta sola. È il comportamento corretto, ma va spiegato agli utenti.

Power BI supporta anche relazioni con cardinalità **molti-a-molti** dirette tra due tabelle (ad esempio fatti a granularità diverse, come Budget mensile per categoria e Vendite giornaliere per prodotto, collegate tramite la categoria). Usale con attenzione e preferisci, quando possibile, una dimensione comune.

## Filtri bidirezionali: con cautela

Attivare "entrambe le direzioni" ovunque sembra comodo, ma:

- può creare **ambiguità** (più percorsi tra due tabelle);
- peggiora le prestazioni;
- con la sicurezza RLS richiede l'opzione specifica per applicare il filtro di sicurezza in entrambe le direzioni.

Preferisci la direzione singola e usa `CROSSFILTER` nelle misure che ne hanno bisogno.

## Buone pratiche

- Nascondi le chiavi esterne nella tabella dei fatti: gli utenti filtrano tramite le dimensioni.
- Segna la tabella delle date come **tabella data**.
- Evita relazioni su colonne con molti valori distinti di tipo testo: usa chiavi intere.
- Riduci al minimo le colonne calcolate nelle tabelle dei fatti: è meglio calcolare a monte (nel lakehouse o nel warehouse).
