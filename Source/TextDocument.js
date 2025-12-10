
class TextDocument
{
	constructor(title, content)
	{
		this.title = title;
		this.content = content;
	}

	static fromDomDocument(d)
	{
		var inputTitle = d.getElementById("inputTitle");
		var title = inputTitle.value;
		var textareaTextToIndex = d.getElementById("textareaTextToIndex");
		var textToIndex = textareaTextToIndex.value;

		var textDocument = new TextDocument(title, textToIndex);

		return textDocument;
	}

	linesForNumbers(lineNumbers)
	{
		var newline = "\n";
		var linesAll = this.content.split(newline);
		var linesSelected = lineNumbers.map(x => linesAll[x]);
		return linesSelected;
	}
}
