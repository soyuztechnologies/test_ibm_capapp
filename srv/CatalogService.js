module.exports = cds.service.impl( async function(){

    //Step 1: get the object of our odata entities
    const { EmployeeSet, POs } = this.entities;

    //Syntax
    //this.WHEN('WHICH_OPERATION', WHAT_ENTITTY, Coda);
    this.before(['CREATE','UPDATE'], EmployeeSet, async (req, res) => {
        console.log("salary leke aa gaya " + req.data.salaryAmount);
        if(parseFloat(req.data.salaryAmount) >= 1000000){
            //throw an exception - reach to CAPM, it terminate the operation
            req.error(500,"Hey Amigo! The salary value not allowed!");
        }
    });
    this.after(['CREATE','UPDATE'], EmployeeSet, async (req, res) => {
        console.log("salary deke aa gaya apni wife ko");
        
    });

    //implementation
    this.on('boost', async (req,res) => {
        try {
            const ID = req.params[0];
            console.log("Hey Amigo, Your purchase order with id " + req.params[0] + " will be boosted");
            const tx = cds.tx(req);
            await tx.update(POs).with({
                GROSS_AMOUNT: { '+=' : 20000 }
            }).where(ID);
        } catch (error) {
            return "Error " + error.toString();
        }
    });

    this.on('largestOrder', async (req,res) => {
        try {
            const ID = req.params[0];
            const tx = cds.tx(req);
            
            //SELECT * UPTO 1 ROW FROM dbtab ORDER BY GROSS_AMOUNT desc
            const reply = await tx.read(POs).orderBy({
                GROSS_AMOUNT: 'asc'
            }).limit(1);

            return reply;
        } catch (error) {
            return "Error " + error.toString();
        }
    });

}
);