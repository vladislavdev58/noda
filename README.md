#template-divasoft

```bash
# Установка
npm i
# Сборка developed версии
npm run build
# Сборка production версии
npm run build
# Запуск веб сервера
npm run start
```

Для добавления новой страницы, например `page.html` в `webpack.config.js` нужно добавить в `plugins` новый инстанс `HtmlWebpackPlugin`:

```js
new HtmlWebpackPlugin({
      template: 'src/new-page.html',
      filename: 'new-page.html',
    })
```