const form=document.getElementById('form'),lista=document.getElementById('lista'),err=document.getElementById('err');
let tareas=[],filtro='todas',nextId=1;
try{const g=localStorage.getItem('lt');if(g){tareas=JSON.parse(g)||[];nextId=tareas.reduce((m,t)=>Math.max(m,t.id),0)+1}}catch(e){}
if(!tareas.length){tareas=[{id:nextId++,titulo:'Leer apuntes de HTML semántico',fecha:'',tipo:'Tarea',prio:'media',hecha:false}]}
const guardar=()=>{try{localStorage.setItem('lt',JSON.stringify(tareas))}catch(e){}};
 
document.getElementById('fecha').textContent=new Date().toLocaleDateString('es',{weekday:'long',day:'numeric',month:'long'});
document.getElementById('fechaLim').min=new Date().toISOString().slice(0,10);
 
function render(){
  lista.innerHTML='';
  const vis=tareas.filter(t=>filtro==='todas'||(filtro==='pendientes'?!t.hecha:t.hecha));
  if(!vis.length){const p=document.createElement('li');p.className='empty';p.style.display='block';p.style.border='0';p.textContent=tareas.length?'No hay tareas en este filtro.':'Aún no tienes tareas. Agrega la primera.';lista.appendChild(p)}
  vis.forEach(t=>{
    const li=document.createElement('li');li.className=t.prio+(t.hecha?' done':'');
    const cb=document.createElement('input');cb.type='checkbox';cb.checked=t.hecha;cb.setAttribute('aria-label','Completar '+t.titulo);
    cb.addEventListener('change',()=>{t.hecha=cb.checked;guardar();render()});
    const d=document.createElement('div');d.className='t';
    const s=document.createElement('strong');s.textContent=t.titulo;
    const m=document.createElement('small');m.textContent=t.tipo+' · prioridad '+t.prio+(t.fecha?' · '+t.fecha:'');
    d.append(s,m);
    const b=document.createElement('button');b.className='del';b.type='button';b.textContent='×';b.setAttribute('aria-label','Eliminar '+t.titulo);
    b.addEventListener('click',()=>{tareas=tareas.filter(x=>x.id!==t.id);guardar();render()});
    li.append(cb,d,b);lista.appendChild(li);
  });
  const c=tareas.filter(t=>t.hecha).length;
  nTotal.textContent=tareas.length;nComp.textContent=c;nPend.textContent=tareas.length-c;
  prog.style.width=(tareas.length?c/tareas.length*100:0)+'%';
}
 
form.addEventListener('submit',e=>{
  e.preventDefault();
  const titulo=form.titulo.value.trim();
  if(titulo.length<3){err.textContent='Escribe al menos 3 caracteres.';form.titulo.focus();return}
  if(!form.fechaLim.value){err.textContent='Elige una fecha límite.';form.fechaLim.focus();return}
  err.textContent='';
  tareas.unshift({id:nextId++,titulo,fecha:form.fechaLim.value,tipo:tipo.value,prio:prio.value,hecha:false});
  guardar();form.reset();render();
});
document.querySelectorAll('.filters button').forEach(b=>b.addEventListener('click',()=>{
  filtro=b.dataset.f;
  document.querySelectorAll('.filters button').forEach(x=>x.setAttribute('aria-pressed',x===b));
  render();
}));
render();