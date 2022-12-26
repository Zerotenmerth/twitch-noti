chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if(message==='CheckTimer')
    {
        CheckActiveTimer();
    }
});
function Global()
{
    let audio = new Audio();
    audio.src = chrome.runtime.getURL(`./res/sound1.mp3`);

    let countPrevious =document.getElementsByClassName('text-fragment').length;
    function CheckMsgs()
    {
        let countNow =document.getElementsByClassName('text-fragment').length;
        if(countPrevious!=countNow)
        {
            console.log('Alert');
            audio.play();
            countPrevious=countNow;
        }
    }
    let timer1 = setInterval(CheckMsgs, 5000);
    SetDataToStorage({"ourTimer": timer1});
    
}

async function CheckActiveTimer()
{
    let result = await GetDataFromStorage("ourTimer");
    if(result==null)
    {
        alert('Таймер активен!');
        Global();
    }
    else 
    {
        clearInterval(result);
        SetDataToStorage({"ourTimer": null});
        alert('Таймер убран');
    }
} 

function GetDataFromStorage(symbol)
{
        return new Promise((resolve, reject)=>
        {
            chrome.storage.local.get(symbol, function(result) {
                for (key in result) {
                    if(key==symbol)
                    resolve(result[key]);
                }
                reject(null);
            });
        }).catch(err => {
        return err;
        });
}

function SetDataToStorage(obj)
{
        chrome.storage.local.set(obj, function() {

        });
}