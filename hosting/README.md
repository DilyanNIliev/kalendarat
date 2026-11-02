# Файлове за хостинга

- `kalendarat.com.htaccess` – влиза във всяка версия за домейна като `.htaccess` (изграждането го копира само). Пренасочва към https и kalendarat.com, включва компресия и кеширане.
- `dilyanilievdesign.com.htaccess` и `dilyanilievdesign.com-index.html` – за основния домейн (`public_html`): страница „Скоро“ и пренасочване на поддомейна към kalendarat.com. Качват се ръчно.
- `subdomain-only.htaccess` – само ако поддомейнът `kalendarat.com.dilyanilievdesign.com` е в друга папка от тази на kalendarat.com.
