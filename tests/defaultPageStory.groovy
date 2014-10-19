using "geb"

scenario "index page", {

    when "we open the index page", {
        go "http://localhost:5984/test/_design/app/_rewrite/"
    }
    then "jquery runs, and changes text to trailhead", {

        $('div.huge').text().shouldBe "Trailhead"
    }
}


scenario "print all documents", {
	when "We are on the default page", {
		go "http://localhost:5984/test/_design/app/_rewrite/"
	}
	then "there is list of all document ids", {
		$('li').size().shouldBeGreaterThan 0
	}
}