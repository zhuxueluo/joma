site.BuildDigitalGrabberV1.moveClawUp = function (){
  site.BuildDigitalGrabberV1.nodes.grabber_arm.animate({ top: -520 }, 1000, function(){
      site.BuildDigitalGrabberV1.win_on = 1;
      site.BuildDigitalGrabberV1.number_of_tries=1;
      for(var i=0; i<site.BuildDigitalGrabberV1.products.length; i++){
          if(!$.leo_unique_keyword){
              console.log("======please set $.leo_unique_keyword")
              debugger
              }
          else{
              console.log("=======$.leo_unique_keyword = "+$.leo_unique_keyword)
              }
        if(site.BuildDigitalGrabberV1.products[i].product_name.indexOf($.leo_unique_keyword)>-1){
        site.BuildDigitalGrabberV1.random_prize = i
        break
        }
      }
    // check if user has won
    if( site.BuildDigitalGrabberV1.win_on != site.BuildDigitalGrabberV1.number_of_tries ){ // user hasn't won
      
      // start moving claw, enable drop button press again
      site.BuildDigitalGrabberV1.nodes.grabber_arm.animate({ left: '20%' }, 3000, function(){
        site.BuildDigitalGrabberV1.moveClawRight();
        site.BuildDigitalGrabberV1.drop_enabled = true;
        site.BuildDigitalGrabberV1.nodes.drop_btn.addClass("pointer");
      });
      
      // increment no. of tries and store in a cookie in case user closes window and comes back to play
      site.BuildDigitalGrabberV1.win_on = 1;
      site.BuildDigitalGrabberV1.number_of_tries=1;
    }
    else{
      
      // user has won
      if (site.BuildDigitalGrabberV1.products[site.BuildDigitalGrabberV1.random_prize].sku_base_id  == site.BuildDigitalGrabberV1.nodes.engraving_sku_id) {
        
        //apply engraving offer
        
        var method = 'rpc.form';
        var offerParams =[{
          "_SUBMIT"    : 'offer_code',
          "OFFER_CODE" : site.BuildDigitalGrabberV1.nodes.engraving_offer_code,
        }];
        var urlParams = '';
        generic.jsonrpc.fetch({
          method: method,
          params: offerParams,
          onSuccess: function(offerRes) {
            site.BuildDigitalGrabberV1.showWinMessage(1);
          }
        });
        
      } else {
        
        // apply offer with regular prize(samples)
        var method = 'offers.apply';
        var offerParams =[{
          "offer_code" : site.BuildDigitalGrabberV1.nodes.offer_code,
          "benefits":
            {
              "ChoiceOfSkus": {"choices":[ site.BuildDigitalGrabberV1.products[site.BuildDigitalGrabberV1.random_prize].sku_base_id ]}
            }
        }];
        
        var urlParams = '';
        generic.jsonrpc.fetch({
          method: method,
          params: offerParams,
          onSuccess: function(offerRes) {
            site.BuildDigitalGrabberV1.offerValid = offerRes.getValue();
            site.BuildDigitalGrabberV1.showWinMessage();
          }
        });
        
      }
    }
  });
  // user hasn't won - drop prize back down whilst claw is moving up
  if( site.BuildDigitalGrabberV1.win_on != site.BuildDigitalGrabberV1.number_of_tries )
    setTimeout(site.BuildDigitalGrabberV1.dropPrize, 700);
};