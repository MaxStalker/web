/* eslint-disable no-console */

$(document).ready(function() {

console.log('1', web3.eth.coinbase);
console.log('network', web3.version.network);


  $('#js-drop').on('dragover', function(event) {
    event.preventDefault();
    event.stopPropagation();
    $(this).addClass('is-dragging');
  });

  $('#js-drop').on('dragleave', function(event) {
    event.preventDefault();
    event.stopPropagation();
    $(this).removeClass('is-dragging');
  });

  $('#js-drop').on('drop', function(event) {
    if (event.originalEvent.dataTransfer.files.length) {
      event.preventDefault();
      event.stopPropagation();
      $(this).removeClass('is-dragging');
    }
  });

  $('.js-select2').each(function() {

    $(this).select2();
  });

  $('#js-newGrant').validate({
    submitHandler: function(form) {

      var data = {};
      var disabled = $(form)
        .find(':input:disabled')
        .removeAttr('disabled');

      


      // Begin New Deploy Subscription Contract

      let bytecode = compiledContract.bytecode;


          let MyContract = web3.eth.contract(compiledContract.abi);
          var myContractReturned = MyContract.new(data.admin_address, data.token_address, data.amount_goal, data.frequency, data.gas_price, {
            from:web3.eth.accounts[0],
            data:bytecode,
            gas:2500000}, function(err, myContract){
              if(!err) {

                // NOTE: The callback will fire twice!
                // Once the contract has the transactionHash property set and once its deployed on an address.
                // e.g. check tx hash on the first call (transaction send)

                if(!myContract.address) {
                  console.log(myContract.transactionHash)



                } else {
                  console.log(myContract.address)

                  $('#transaction_hash').val(myContract.transactionHash)
                  $('#contract_address').val(myContract.contract_address)
                  $('#network').val(web3.version.network)

                  $.each($(form).serializeArray(), function() {
                    data[this.name] = this.value;
                  });

                  form.submit();


                }
              }
            });

    }
  });

  function addChainData(transaction_hash, contract_address, network, title){

    console.log('in the function');

    // const url = '/grants/data/' + title;

    const url = '/grants/data/ad';


    fetch(url, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        transaction_hash: transaction_hash,
        contract_address: contract_address,
        network: network
      })
    })
    // .then(function(response) {
    //   console.log('something here', response.json());
    //   return response.json();
    // })

  }

// Will need this for a subscription

  var check_balance_and_alert_user_if_not_enough = function(tokenAddress, amount) {
    var token_contract = web3.eth.contract(token_abi).at(tokenAddress);
    var from = web3.eth.coinbase;
    var token_details = tokenAddressToDetails(tokenAddress);
    var token_decimals = token_details['decimals'];
    var token_name = token_details['name'];

    token_contract.balanceOf.call(from, function(error, result) {
      if (error) return;
      var balance = result.toNumber() / Math.pow(10, 18);
      var balance_rounded = Math.round(balance * 10) / 10;

      if (parseFloat(amount) > balance) {
        var msg = gettext('You do not have enough tokens to fund this bounty. You have ') + balance_rounded + ' ' + token_name + ' ' + gettext(' but you need ') + amount + ' ' + token_name;

        _alert(msg, 'warning');
      }
    });
  };




  $('#new-milestone').on('click', function(event) {
    event.preventDefault();
    var milestones = $('.milestone-form .row');
    var milestoneId = milestones.length || 1;

    $('.milestone-form').append('<div class="row" id="milestone' + milestoneId + '">' +
      '<div class="col-12">\n' +
      '<input type="text" class="form__input" placeholder="Title" name="milestone-title[' + milestoneId + ']" required/>' +
      '<input type="date" class="form__input" placeholder="Date" name="milestone-date[' + milestoneId + ']" required/>' +
      '<textarea class="form__input" type="text" placeholder="Description" name="milestone-description[' + milestoneId + ']" required></textarea>' +
      '</div>' +
      '</div>');
  });

  waitforWeb3(function() {
    tokens(document.web3network).forEach(function(ele) {
      var option = document.createElement('option');

      option.text = ele.name;
      option.value = ele.addr;

      $('#js-token').append($('<option>', {
        value: ele.addr,
        text: ele.name
      }));
    });

    $('#js-token').select2();
  });

});
