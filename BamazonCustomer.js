var mysql = require('mysql');
var prompt = require('prompt');
var ID;
var quantity;
var con = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '?????',
	database : 'bamazon'
});

con.connect(function (err)
{
	if (err)
	{
		console.log(err);
	}
	console.log("Welcome to Bamazon!");
});

con.query('SELECT * FROM products', function(err, rows){
	if (err)
	{
    return callback(err);
  }
  console.log("Item ID\tItem Name\t\tPrice");
  for(var i = 0; i < rows.length; i++)
  {
  	console.log(rows[i].ItemID + '\t' + rows[i].ProductName + '\t\t$' + rows[i].Price + '\t');
  }
  console.log("\nWhat would you like to order?\nEnter the item ID number and a quantity.");
	prompt.start();
	prompt.get(['ItemID', 'quantity'], function(err, order){
		ID = order.ItemID;
		quantity = order.quantity;
		prompt.stop();
		con.query('SELECT * FROM products WHERE ItemID = "' + ID + '"', function(err, product){
  		if(product[0].StockQuantity >= quantity)
  		{
  			var newQuant = product[0].StockQuantity - quantity;
  			con.query('UPDATE products SET StockQuantity = "' + newQuant + '" WHERE ItemID = "' + ID + '"', function(err, result){
  				if(err)
  				{
  					throw err;
  				}
  			});
  			console.log("You ordered " + quantity + " of this item: " + product[0].ProductName);
				console.log("Your total is: $" + product[0].Price * quantity);
			}
			else
			{
				console.log("Insufficient Quantity.  Transaction could not be completed.");
			}
		});
	});
});
