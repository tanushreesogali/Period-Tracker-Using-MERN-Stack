const mongoose = require("mongoose");

const periodSchema = new mongoose.Schema({
    email:String ,
    startDate:String,
    endDate:String,
    cycleLength: Number,
    periodLength:Number
    
});

// unsure of how to reference email from user -- using cookies as of now
//symptoms and notes are avoided for now
//in future, make only start date as required, enddate calculated based on avg of previoud periodLengths and user can later edit their period log

periodSchema.pre('save',async function(next){
    const PeriodLog= mongoose.model('period_logs');

    //endDate 
    if(this.startDate && !this.endDate){
        let prevPeriodLength= '';
        await PeriodLog.findOne({
            email:this.email
        }).sort({startDate:-1})
        .then(prevLog=>{
            if(prevLog){
                prevPeriodLength=prevLog.periodLength;
                // this.periodLength=prevLog.periodLength;
                
            }
            else{
                prevPeriodLength='5';
            }
            const currStart= new Date(this.startDate);
                let days= parseInt(prevPeriodLength,10)-1;
                const milliPeriodLength=days*24*1000*60*60;
                const calcEndDate = new Date(currStart.getTime()+milliPeriodLength);
                this.endDate = calcEndDate.toISOString().split('T')[0];

        })
    }
    
    //Period length
    if(this.startDate && this.endDate){
        const start = new Date(this.startDate);
        const end = new Date(this.endDate);
        this.periodLength=Math.ceil((end-start)/(1000*60*60*24))+1;
    }


    //Cycle Length
    if(this.startDate){
        await PeriodLog.findOne({
            email:this.email
        }).sort({startDate:-1})
        .then(prevLog=>{
            if(prevLog){
                const prevStart=new Date(prevLog.startDate);
                const currStart= new Date(this.startDate);
                this.cycleLength=Math.ceil((currStart-prevStart)/(1000*60*60*24));
            }
            else{
                this.cycleLength=30;
            }
        })
    }

    next();
})


const periodLog= mongoose.model("period_logs",periodSchema);

module.exports=periodLog;