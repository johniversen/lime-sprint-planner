# lime-sprint-planner

För information om hur du kan konfiguera appen, se: lime-sprint-planner/limepkg-uni/limepkg_uni/config/config.yaml

### Framtida implementeringar
* Implmentering av taggar.
* För närvarande är ikonerna i dialogen hårdkodad. Borde ändras till att motsvara en tagg för kortet.
* Färgerna för de olika statusarna är hårdkodade. Borde ändras till att motsvara statusen, om där redan finns "färger för statusar".
* Kortens grid är gjorda med custom css. Borde "lime-fieras".
* Korten skulle kunna snyggas till ytterliggare. För närvarande hanteras allt som ska finnas i kortet i ett enda objekt, och kan därför inte stylas individuellt. Dvs. du kan inte ändra hur stor del av kortet vem som är ansvarig ska ta, utan det kommer alltid ta lika stor plats som t.ex. tidsestimeringen.
* Ikon på kort som motsvarar tagg. För närvarande finns bara ikon på kort om kortets prioritering är akut/urgent.
* Fortsatt implentering av andra punkter än solutionimprovement.
      * T.ex. datumhantering i Deal eller Company, om det skulle finnas något som känns naturligt.


### Installationsinstruktioner för utvecklingsmiljö
Samt startande av webserver

Gör följande i din VM:

1. Ställ dig i c:\src i Git Bash
2. Skriv git clone https://github.com/johniversen/lime-sprint-planner.git
3. Byt till Lime Pro Command cmd - Cd in i c:\src\lime-sprint-planner
4. Cd in i limepkg-uni
5. Skriv pip install -e . --no-use-pep517
6. Cd in i frontend
7. Skriv npm install
8. Skriv npm start
9. Öppna ny lime console, cd till nya repot, skriv pip uninstall limepkg-sprint
10. Bekräfta med ‘y’
11. Om det står något i stil med att ingen sådan fil hittas, gå vidare till nästa steg
12. I lime console, skriv lime-webserver-debug
13. Navigera till localhost/client/ i Chrome 
      (https://localhost/client/ ifall det inte fungerar, eller https://127.0.0.1:5442/client/)
14. Logga in med username: admin, lösen: 
