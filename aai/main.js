function showMore( link, object ) {
	$( link ).click( function() {
		$( object ).toggle();
	});
}

$( document ).ready( function() {
	showMore( '.toggle', '.information' );
	showMore( '.toggle2', '.information2' );
});
