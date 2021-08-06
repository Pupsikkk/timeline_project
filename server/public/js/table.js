class Table{
    constructor(fromYear, toYear, yearStep, yearHeight){
        this.container = document.querySelector('.timeline-years-container');
        this.containerH = (toYear - fromYear)*yearHeight + 140;
        document.querySelector('.timeline-wrapper').setAttribute('style',`height:${this.containerH }px;`);
        this.fromYear = fromYear;
        this.toYear = toYear;
        this.yearStep = yearStep;
        this.yearHeight = yearHeight;
        
        let curYear = toYear;
        let counter = 0;
        while(curYear%yearStep != 0){
            curYear -= 1;
            counter += 1;
        }
        this.startLinePosition = counter*yearHeight;
        let curStep = this.startLinePosition;
        while (curYear >= this.fromYear) {
            this.container.insertAdjacentHTML('beforeend', `<div class="timeline-years-year" style="top:${curStep}px;">${curYear}</div>`)
            this.container.insertAdjacentHTML('beforeend', `<div class="timeline-years-lines" style="top:${curStep+20}px;"></div>`)
            curStep += yearHeight*yearStep;
            curYear -= yearStep;
        }
    }

    reDrawTable = (fromYear, toYear, yearStep, yearHeight) => {
        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }
        this.containerH = (toYear - fromYear)*yearHeight + 140;
        document.querySelector('.timeline-wrapper').setAttribute('style',`height:${this.containerH}px;`);
        this.fromYear = fromYear;
        this.toYear = toYear;
        this.yearStep = yearStep;
        this.yearHeight = yearHeight;
        
        let curYear = toYear;
        let counter = 0;
        while(curYear%yearStep != 0){
            curYear -= 1;
            counter += 1;
        }
        this.startLinePosition = counter*yearHeight;
        let curStep = this.startLinePosition;
        while (curYear >= this.fromYear) {
            this.container.insertAdjacentHTML('beforeend', `<div class="timeline-years-year" style="top:${curStep}px;">${curYear}</div>`)
            this.container.insertAdjacentHTML('beforeend', `<div class="timeline-years-lines" style="top:${curStep+20}px;"></div>`)
            curStep += yearHeight*yearStep;
            curYear -= yearStep;
        }
    }
}