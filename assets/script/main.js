const Formulario_endereco = {

  init: function(){
    this.cacheSelectors()
    this.bindEvents()
  },
  bindEvents: function(){
    this.$cep.onkeydown = this.Events.cep_keydown.bind(this)
    this.$formEndereco.onsubmit = this.Events.address_submit.bind(this)
  },
  resetForm: function(timeout){
    setTimeout(()=>{this.$formEndereco.reset()}, timeout)
  },
  submitForm: function(timeout){
    setTimeout(()=>{this.$formEndereco.submit()}, timeout)
  },
  displayToast: function(toast, type, message, timeout){
    toast.innerHTML = message
    toast.classList.toggle(type)
    toast.classList.toggle(this.Classes.toast.hidden)

    setTimeout(()=>{
      toast.classList.toggle(type)
      toast.classList.toggle(this.Classes.toast.hidden)
    }, timeout)
  },

  cacheSelectors: function(){
    this.$formEndereco = document.querySelector('#formEndereco')
    this.$cep = document.querySelector('#cep')
    this.$cepToast = document.querySelector('#cepToast')
    this.$rua = document.querySelector('#rua')
    this.$bairro = document.querySelector('#bairro')
    this.$cidade = document.querySelector('#cidade')
    this.$estado = document.querySelector('#estado')
    this.$ibge = document.querySelector('#ibge')
    this.$submitButton = document.querySelector('#submitButton')
    this.$submitToast = document.querySelector('#submitToast')
  },

  getAddressByCep: async function(cep){
    return await fetch(`https://viacep.com.br/ws/${cep}/json/`).then(response => response.json())
  },

  fillAddressForm: function(address){
    if(address.erro){
      this.displayToast(this.$cepToast, this.Classes.toast.warning,this.Messages.cep_notFound, this.Timer.msg)
      this.resetForm(this.Timer.msg)

    }else{
      this.$rua.value = address.logradouro
      this.$bairro.value = address.bairro
      this.$cidade.value = address.localidade
      this.$estado.value = address.uf
      this.$ibge.value = address.ibge

      this.displayToast(this.$cepToast, this.Classes.toast.success,this.Messages.cep_found, this.Timer.msg)
    }
  },

  Events:{
    cep_keydown: function(e){
      if(e.key === 'Tab' || e.key === 'Enter'){
        const cep = this.$cep.value
        if(cep.length != 8){
          this.displayToast(this.$cepToast, this.Classes.toast.error,this.Messages.cep_invalid,this.Timer.msg)
          this.resetForm(this.Timer.msg)
        }else{
          this.getAddressByCep(cep).then(address => this.fillAddressForm(address))
        }
      }
    },

    address_submit: function(e){
      e.preventDefault()
      const cep = this.$cep.value
      if(cep.length != 8){
        this.displayToast(this.$cepToast, this.Classes.toast.error,this.Messages.cep_invalid,this.Timer.msg)
        this.resetForm(this.Timer.msg)
      }else{
        this.getAddressByCep(cep).then(address => this.fillAddressForm(address))
        this.displayToast(this.$submitToast, this.Classes.toast.success,this.Messages.address_sent,this.Timer.msg)
        this.submitForm(this.Timer.msg)
      }
    },
  },
  Messages:{
    cep_invalid: 'Cep Inválido!',
    cep_notFound: 'Cep não encontrado!',
    cep_found: 'Cep encontrado!',
    address_sent: 'Endereço enviado!',

  },
  Timer:{
    msg: 2000
  },
  Classes:{
    toast:{
      success: 'success',
      warning: 'warning',
      error: 'error',
      hidden: 'hidden',
    }
  }
}

Formulario_endereco.init()