function showMore( link, object ) {
	$( link ).click( function() {
		$( object ).toggle();
	});
}

$( document ).ready( function() {
	showMore( '.toggle', '.information' );
	showMore( '.toggle2', '.information2' );
	showMore( '.toggle3', '.information3' );
	showMore( '.toggle4', '.information4' );
	showMore( '.toggle5', '.information5' );
	showMore( '.toggle6', '.information6' );
	showMore( '.toggle7', '.information7' );
	showMore( '.toggle8', '.information8' );
});
