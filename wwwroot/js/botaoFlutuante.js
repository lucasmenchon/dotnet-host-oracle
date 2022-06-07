function toggleFAB(fab){
	if(document.querySelector(fab).classList.contains('show')){
  	document.querySelector(fab).classList.remove('show');
  }else{
  	document.querySelector(fab).classList.add('show');
  }
}

document.querySelector('.fab .main').addEventListener('click', function(){
	toggleFAB('.fab');
	
});

document.querySelector('.icone-whats').addEventListener('click',function(){
	window.open("https://www.w3schools.com");
});
document.querySelectorAll('.fab ul li button').forEach((item)=>{
	item.addEventListener('click', function(){
		toggleFAB('.fab');
	});
	
});

function linkWhatsApp(){
	window.open("https://wa.link/qzdch8");

}