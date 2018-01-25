// function getAllData() {
//     return([
//         { key: 'isValid', value: true },
//         { key: 'isPurchased', value: false },
//         { key: 'test1', value: false },
//         { key: 'test2', value: false },
//         { key: 'test3', value: true }
//      ]);
// }


exports.getData = function(req, res) {
    
      res.json([
                { key: 'isValid', value: true },
                { key: 'isPurchased', value: false },
                { key: 'test1', value: false },
                { key: 'test2', value: false },
                { key: 'test3', value: true }
             ]);
  
  };

  exports.sendData = function(req, res) {
  
  };