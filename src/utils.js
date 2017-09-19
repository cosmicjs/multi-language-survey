
// clever work-around to render html-entities (source: https://stackoverflow.com/a/7394787/7974185)
export function processHTMLEntities(data){
    const area = document.createElement('textarea');
    area.innerHTML = data;
    return area.value;
}