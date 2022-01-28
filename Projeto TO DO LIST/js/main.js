
const Main = {

  tasks: [],//array 01

  init: function() {
    this.cacheSelectors()//Selecionar os ids e clases
    this.bindEvents()//Adicionar os eventos
    this.getStoraged()//obtenha o armazenamento
    this.buildTasks()
    
  },

  cacheSelectors: function () {
    this.$checkButtons = document.querySelectorAll('.check')
    this.$inputTask = document.querySelector('#inputTask')
    this.$list = document.querySelector('#list')
    this.$removeButtons = document.querySelectorAll('.remove')
  },

  bindEvents: function () {
    const self = this

    this.$checkButtons.forEach(function(button){
      button.onclick = self.Events.checkButton_click.bind(self)
    })

    this.$inputTask.onkeypress = self.Events.inputTask_keypress.bind(this)

    this.$removeButtons.forEach(function(button) {
      button.onclick = self.Events.removeButton_click.bind(self)
    })
  },


  getStoraged: function () {
    const tasks = localStorage.getItem('tasks')

    if (tasks) {
      this.tasks = JSON.parse(tasks)//Aqui ele transforma a const tasks em um objeto. e armazena o que esta no array 01
    } else {
      localStorage.setItem('tasks', JSON.stringify([]))
    }

    
  },

  getTaskHtml: function(task, isDone) {
    return `
      <li class="${isDone ? 'done' : ''}" data-task="${task}">          
        <div class="check" ></div>
        <label class="task">
          ${task}
        </label>
        <button class="remove"></button>
      </li>
    `
  },

  insertHTML: function(element, htmlString) {
    element.innerHTML += htmlString

    this.cacheSelectors()
    this.bindEvents()
  },

  buildTasks: function() {//Papel dele é montar as terefas na tela
    let html = ''

    this.tasks.forEach(item => {
      html += this.getTaskHtml(item.task, item.done)//Aqui eu chamo a função getTaskHtml
   

    })//O data siginifica que eu posso um parametro para o js


    this.insertHTML(this.$list, html)
    
  },


  Events: {
    checkButton_click: function(e) {
      const li = e.target.parentElement
      const value = li.dataset['task']
      const isDone = li.classList.contains('done')

      const newTasksState = this.tasks.map(item => {
        if (item.task === value) {
          item.done = !isDone
        }

        return item
      })

      localStorage.setItem('tasks', JSON.stringify(newTasksState))

      if (!isDone) {
        return li.classList.add('done')       
      }

      li.classList.remove('done')
    },

    inputTask_keypress: function(e) {//metodo de adicionar tarefas
      const key = e.key
      const value = e.target.value
      const isDone = false

      if (key === 'Enter') {
        const taskHtml = this.getTaskHtml(value, isDone)

        this.insertHTML(this.$list, taskHtml)

        e.target.value = ''

        const savedTasks = localStorage.getItem('tasks')//Aqui eu pego as terefas que estão salvas 
        const savedTasksArr = JSON.parse(savedTasks)//Aqui eu transformo elas em objeto

        const arrTarks = [
          { task: value, done: isDone },
          ...savedTasksArr,//Aqui eu pego as tarefas salvas e incluo com as novas
          
      ]

        const jsonTasks = JSON.stringify(arrTarks)

        this.tasks = arrTarks
        localStorage.setItem('tasks', jsonTasks)
      }
    },

    removeButton_click: function(e) {
      const li = e.target.parentElement//Aqui ele verificar o texto que esta dentro da array 01, quando for localizado eu removo da aaray 01 e mando salvar o array no localstorage
      const value = li.dataset['task']//Aqui eu pego o valor do botão ou seja o parametro que foi passado pra ele
      
      const newTasksState = this.tasks.filter(item => {
        console.log(item.task, value)//Aqui eu percorro os elementos e filtro o que for diferente do const value, com isso eu vou ter um novo array sem este elemento
        return item.task !== value
      })

      localStorage.setItem('tasks', JSON.stringify(newTasksState))//Aqui eu salvo os items da tasks no localstorage
      this.tasks = newTasksState

      li.classList.add('removed')

      setTimeout(function () {
        li.classList.add('hidden')
      }, 300)
    }
  }

}

Main.init()
        


