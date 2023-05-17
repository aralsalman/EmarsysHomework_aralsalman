/*  Emarsys Homework
    Due Date Calculator
    By Abbas Alsalman 5/16/23

    Language: Javascript
    Run 'node CalculateDueDate.js' in terminal to run the desired tests
*/

/*Function isValidWorkingDateTime() to determine if a submitted Date/Time is within the working hours and working days*/
function isDuringWorkHours(dateTime) {
    return (dateTime.getUTCHours() >= 9 && (dateTime.getUTCHours() < 17  
    || (dateTime.getUTCHours() === 17 && dateTime.getUTCMinutes() === 0)) 
    && (dateTime.getUTCDay() >= 1 && dateTime.getUTCDay() <=5));
}

/*Function calculateDueDate() to calculate the date that resolving an issue is to be due by*/
function calculateDueDate(submittedDateTime, turnaroundTime) {
    /*Throw an error if the submitted date time is not valid working time or if the inputted turnaroundTime is not a number*/
    if (!isDuringWorkHours(submittedDateTime)) {
        throw Error("Please submit the issue during work hours.");
    }
    if(isNaN(turnaroundTime) || turnaroundTime<0){
        throw Error("Please enter a real (positive) number for the turnaroundTime.");
    }
    /*Create a Date object for the issue's submitted date*/
    var dateTime = new Date(submittedDateTime);
    /*Convert turnaroundTime from hours into milliseconds for the purpose of calculating rather than convering the .getTime() values into hours*/ 
    var turnaroundTimeLeft = turnaroundTime * 1000 * 60 * 60;
    /*While loop to calculate the due date if turnaroundTime is greater than 0*/
    while (turnaroundTimeLeft > 0) {
        /*First, create a new Date object and set it equal to the end of the work day time (17hours and 0 minutes or 5pm), to use to calculate the remaining work time of the day*/
        var endOfWorkTime = new Date(dateTime);
        endOfWorkTime.setUTCHours(17);
        endOfWorkTime.setUTCMinutes(0);

        /*then, find the remaining work time of the day by subtracting end of day time we created and the date time of the current work hour*/
        var remainingWorkTime = endOfWorkTime.getTime() - dateTime.getTime();

        /*Determine if the due date will be within the same work day or if we will need to go on to the next day.
          If we need to go onto the next day, then set workTime to the remaining workTime to get to the end of the work day.
          Else set workTime to the remaining time left till the due date*/
        if(remainingWorkTime<turnaroundTimeLeft){
            var workTime = remainingWorkTime;
        } else{
            var workTime = turnaroundTimeLeft;
        }

        /*Then set the dateTime to the workTime to either actually change it to the due date or to the end of the work day*/
        dateTime.setTime(dateTime.getTime() + workTime);
        /*Make sure we're keeping track of the time left till the end of the turn around time, which is the turnaroundTimeLeft - what we set the workTime to*/
        turnaroundTimeLeft = turnaroundTimeLeft - workTime;
        
        /*If the turnaroundTimeLeft is still greater than 0, then we will need to change the date to the next work day (9hours and 0 minutes or 9:00am)
          Then if so, also continue the while loop till there is no turnaroundTimeLeft, 
          because once turnaroundTime=0 then we have succesfully calculated the due date*/
        if (turnaroundTimeLeft > 0) {
            do {
                dateTime.setDate(dateTime.getDate() + 1);
            } while (!isDuringWorkHours(dateTime));
            dateTime.setUTCHours(9);
            dateTime.setUTCMinutes(0);
        }
    } 

    /*Return the calculated due date*/
    return dateTime;
};

/*Note: 
    Date.UTC(year, month, day, hour, min)
    Jan, Feb, Mar, ... = 0, 1, 2, ... for the month
    Use 24-hour time units for the hour, so 2:12pm would be 13 hour and 12 minutes
*/
//Test Values
var issueDate0 = new Date(Date.UTC(2023, 4, 16, 13, 12)); //issueDate entered for Tuesday, May 16th, 2:12PM
var issueDate1 = new Date(Date.UTC(2023, 4, 19, 9, 00)); //issueDate entered for Friday, May 19th, 9:00AM
var issueDate2 = new Date(Date.UTC(2023, 4, 19, 16, 59)); //issueDate entered for Friday, May 19th, 4:59PM
var issueDate3 = new Date(Date.UTC(2023, 4, 20, 12, 00)); //issueDate entered for Saturday, May 20th, 12:00PM -- not during work day
var issueDate4 = new Date(Date.UTC(2023, 4, 22, 7, 00)); //issueDate entered for Monday, May 22nd, 7:00AM -- not during work hours
var turnaroundTime0 = 8;
var turnaroundTime1 = 16;
var turnaroundTime2 = 'a'; //invalid turnaroundTime value
var turnaroundTime3 = -1; //invalid turnaroundTime value

//Calculate Due Date and output it to console log
var dueDate = calculateDueDate(issueDate0, turnaroundTime1);
console.log("\nIssue reported on [" + issueDate0.toUTCString()+"] is to be resolved in " 
            + turnaroundTime1 +" work hours by [" + dueDate.toUTCString()+"].\n");