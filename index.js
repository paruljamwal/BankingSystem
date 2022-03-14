const express=require("express");
const mongoose=require("mongoose")
const app=express();
app.use(express())
const connect=()=>{
  return mongoose.connect("mongodb+srv://paru:paru@cluster0.dai2j.mongodb.net/bank?retryWrites=true&w=majority")
}

//userschema

const User=mongoose.Schema({
    firstName:{type:String,require:true},
    middleName:{type:String},
    lastName:{type:String,require:true},
    age:{type:Number,require:true},
    email:{type:String,require:true},
    address:{type:String,require:true},
    gender:{type:String},
    type:{type:String}

},
{
    timespans:true
});

const Usermodel=new mongoose.model("User",User)

//branch

const BranchDetails=mongoose.Schema({
    name:{type:String,require:true},
     address:{type:String,require:true},
     IFSC:{type:String,require:true},
     MICR:{type:Number,require:true},
     master_id:{type:mongoose.Schema.Types.ObjectId,ref:"MasterAccount",require:true}
},
{
    timespans:true
});

const Branchmodel=new mongoose.model("branch",BranchDetails)

//MAster

const MasterAccount=mongoose.Schema({
  balance:{type:Number,require:true},
  User_id:{type:mongoose.Schema.Types.ObjectId,ref:"User",require:true},
   branch_id:{type:mongoose.Schema.Types.ObjectId,ref:"BranchDetails",require:true}
},
{
    timespans:true
});

const Mastermodel=new mongoose.model("master",MasterAccount)

//SavingAccount
const SavingsAccount=mongoose.Schema({
    accountnumber:{type:Number,require:true},
    balance:{type:String,require:true},
    interstRate:{type:Number,require:true},
    User_id:{type:mongoose.Schema.Types.ObjectId,ref:"User",require:true}

},
{
    timespans:true
});

const savingmodel=new mongoose.model("saving",SavingsAccount)

//FixedAccount
const FixedAccount=mongoose.Schema({
     accountnumber:{type:Number,require:true},
      balance:{type:Number,require:true},
     interstRate:{type:Number,require:true},
   startDate:{type:Number,require:true},
   maturityDate:{type:Number,require:true},
   User_id:{type:mongoose.Schema.Types.ObjectId,ref:"User",require:true},
   master_id:{type:mongoose.Schema.Types.ObjectId,ref:"MasterAccount",require:true}
},
    {
        timespans:true
    })

 const Fixedmodel=mongoose.model("fixed",FixedAccount)


 app.get("/user",async(req,res)=>{
     try{
        const user=await User.find().lean().exec()
        return req.statusCode(200).send(user)
     }
     catch(err){
        req.statusCode(404).send("Somthing went wrong ")
     }
   
    });

    
 app.get("/user/:id",async(req,res)=>{
    try{
       const user=await Usermodel.find(req.params.id).populate({"name":1 , _id:0 , "accountnumber":true})
       return req.statusCode(200).send(user)
    }
    catch(err){
       req.statusCode(404).send("Somthing went wrong ")
    }
  
   });


   //get master acc

   app.get("/master",async(req,res)=>{
       try{
        const masters= await Mastermodel.find().lean().exec();
        return req.statusCode(200).send(masters)
       }
       catch(err){
        req.statusCode(404).send("Somthing went wrong ")
     }
      
   });

   //post for creating saving acc,


   app.post("/saving",async(req,res)=>{
       try{
        const savings= await savingmodel.create(req.body);
        return req.statusCode(200).send(savings)
       }
       catch(err){
        req.statusCode(404).send("Somthing went wrong ")
       }
   });

   app.patch("/master",async(req,res)=>{
    try{
     const masters= await mastermodel.findByIdAndUpdate(req.body).populate({balance:1});
     return req.statusCode(200).send(masters)
    }
    catch(err){
     req.statusCode(404).send("Somthing went wrong ")
    }
});

 app.post("/user",async(req,res)=>{
     try{
        const users= await Usermodel.find().lean().exec();
        return req.statusCode(200).send(users)
     }
     catch(err){
        req.statusCode(404).send("Somthing went wrong ") 
     }
 })

app.get("/master/:id",async(req,res)=>{
    try{
      const master=await Mastermodel.findById(req.params.id).populate({accountnumber:1, _id:0})
      return req.statusCode(200).send(master);
    }
    catch(err){
        req.statusCode(404).send("Somthing went wrong ") 
    }
})

app.get("/fixed",async(req,res)=>{
    try{
       const fixed= await Fixedmodel.find().lean().exec();
       return req.statusCode(200).send(fixed)
    }
    catch(err){
       req.statusCode(404).send("Somthing went wrong ") 
    }
})


app.post("/fixed/:id",async(req,res)=>{
    try{
       const users= await Usermodel.create(req.params.id);
       return req.statusCode(200).send(users)
    }
    catch(err){
       req.statusCode(404).send("Somthing went wrong ") 
    }
})


app.delete("/fixed/:id",async(req,res)=>{
    try{

        
        const users= await Usermodel.findByIdAndDelete(req.params.id);
        return req.statusCode(200).send(users)
     }
     catch(err){
        req.statusCode(404).send("Somthing went wrong ") 
     }
})


app.listen(5555,async (req,res)=>{
    try{
       await connect()
    }
    catch(err){
        console.log("Somthing went wrong please try again later")
    }
    console.log("Listining port no. 5555")
})