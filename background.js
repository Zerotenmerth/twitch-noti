let tabID;
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab)
{
    if(tab.url.includes('twitch.tv'))
    tabID=tab.id;
});
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
    if(tabID==tabId)
    {
        console.log('twitch tab was closed');
        delete tabID;
    }       
});