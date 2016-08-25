angular.module('translate',['pascalprecht.translate'])

app.config(function($translateProvider){
 $translateProvider.translations('it', {
		'HOME':'Pagina iniziale',
		
		'error.user.name':"Errore! L'username non è valorizzato",
    'error.user.password':"Errrore! La password non è valorizzata",
    "error.newpoll.name":"Errore! Il nome del sondaggio non è valorizzato",
    "error.newpoll.description":"Errore! La descrizione del sondaggio non è valorizzata"
  });
 
  $translateProvider.translations('en', {
	  'HOME':"Home page",
	  "error.user.name":"Error! Username required!",
	  'error.user.password':'Error! Password required!',
	  "error.newpoll.name":"Error! Name of the poll required!",
	  "error.newpoll.description":"Error! Description of the poll required!"
  });
    $translateProvider.fallbackLanguage('en');
 
$translateProvider.preferredLanguage("en");
$translateProvider.useSanitizeValueStrategy('escape');
})