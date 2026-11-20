## Obiettivo

Creare un lakehouse, caricare un file, trasformarlo in tabella Delta e creare uno shortcut. Ti serve un workspace in una capacità Fabric (va bene anche una **versione di valutazione gratuita** di Fabric).

## Passaggi

1. Nel workspace seleziona **Nuovo item → Lakehouse** e chiamalo `LH_Corso`.
2. Crea sul tuo computer un file `prodotti.csv` con questo contenuto:

~~~
IdProdotto,Nome,Categoria,Prezzo
1,Zaino Trek,Outdoor,79.90
2,Borraccia,Outdoor,12.50
3,Cuffie BT,Elettronica,59.00
4,Powerbank,Elettronica,25.00
~~~

3. Nella cartella **Files** scegli **Carica → Carica file** e carica `prodotti.csv`.
4. Dal menu del file scegli **Carica nelle tabelle → Nuova tabella** e chiamala `prodotti`.
5. Apri l'**endpoint di analisi SQL** del lakehouse ed esegui una query che calcoli il prezzo medio per categoria.
6. Crea un secondo lakehouse `LH_Report` e, nella sua cartella **Tables**, crea uno **shortcut OneLake** verso la tabella `prodotti` di `LH_Corso`.
7. Rispondi: se elimini lo shortcut in `LH_Report`, cosa succede ai dati in `LH_Corso`? E se provi a eseguire un `UPDATE` sulla tabella dall'endpoint SQL?

<!-- SOLUZIONE -->

**Query del punto 5**

~~~sql
SELECT Categoria, AVG(Prezzo) AS PrezzoMedio
FROM dbo.prodotti
GROUP BY Categoria;
~~~

Risultato atteso: Outdoor ≈ 46,20 e Elettronica = 42,00.

**Risposte al punto 7**

- Eliminando lo shortcut **i dati originali restano intatti** in `LH_Corso`: lo shortcut è solo un riferimento.
- L'`UPDATE` dall'endpoint di analisi SQL **fallisce**: l'endpoint del lakehouse è in sola lettura per le tabelle. Per modificare i dati usa Spark (notebook) o Dataflow Gen2, oppure gestisci la tabella in un warehouse.

**Verifica**: nella tabella `prodotti` di `LH_Report` l'icona indica che si tratta di uno shortcut, e la query restituisce gli stessi dati di `LH_Corso`.
