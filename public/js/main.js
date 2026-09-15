const backBtn = document.getElementById('btn-back');
if (backBtn) {
    backBtn.addEventListener('click', function(){
        window.location.href="/";
    });
}
const refreshForm = document.querySelector('form');
if (refreshForm){
    refreshForm.addEventListener('submit',function(){
        const refreshBtn = document.getElementById('refresh-btn')
        refreshBtn.disabled=true;
        refreshBtn.textContent="Refreshing..."
    })
}