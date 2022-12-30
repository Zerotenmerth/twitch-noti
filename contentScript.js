chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if(message==='CheckTimer')
    {
        CheckActiveTimer();
    }
    if(message=="ChangeSound")
    {
        LoadPathOfSoundFile();
    }
});
let audio = new Audio();
LoadPathOfSoundFile();
async function LoadPathOfSoundFile()
{
    let fileNameOfAlert = await GetDataFromStorage("fileNameOfAlert");
    audio.src=chrome.runtime.getURL(`./res/${fileNameOfAlert}`);
}

function Global()
{
    let countPrevious =document.getElementsByClassName('text-fragment').length;
    function CheckMsgs()
    {
        let countNow =document.getElementsByClassName('text-fragment').length;
        if(countPrevious!=countNow)
        {
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
        Global();
    }
    else 
    {
        clearInterval(result);
        SetDataToStorage({"ourTimer": null});
        alert('Scanning disabled!');
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