# lime-sprint-planner

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
