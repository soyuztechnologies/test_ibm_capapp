using { anubhav.db } from '../db/datamodel';
using { cappo.cds } from '../db/CDSViews';

//Rob Changes on 10-Jan
service CatalogService @(path:'CatalogService') {

    @Capabilities : { Insertable, Deletable: false }
    entity BusinessPartnerSet as projection on db.master.businesspartner;
    entity AddressSet as projection on db.master.address;
    //@readonly
    entity EmployeeSet as projection on db.master.employees;
    entity PurchaseOrderItems as projection on db.transaction.poitems;
    entity ProductSet as projection on db.master.product;
    entity POs @( odata.draft.enabled: true ) as projection on db.transaction.purchaseorder{
        *,
        round(GROSS_AMOUNT) as GROSS_AMOUNT: Decimal(10,2),
        case OVERALL_STATUS
            when 'N' then 'New'
            when 'P' then 'Pending'
            when 'D' then 'Delivered'
            when 'A' then 'Approved'
            when 'X' then 'Rejected'
            end as OverallStatus: String(10),
        case OVERALL_STATUS
            when 'N' then 2
            when 'P' then 2
            when 'D' then 3
            when 'A' then 3
            when 'X' then 1
            end as Criticality: Integer,
        Items: redirected to PurchaseOrderItems
    }actions{
        //definition
        @cds.odata.bindingparameter.name: '_anubhav'
        @Common.SideEffects:{
            TargetProperties:['_anubhav/GROSS_AMOUNT']
        }
        action boost();
        function largestOrder() returns array of POs;
    };
    //entity CProductValuesView as projection on cds.CDSViews.CProductValuesView;

}