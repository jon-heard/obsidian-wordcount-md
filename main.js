// WordCountMd - A plugin to count the NON-MARKDOWN words of selected text in the editor.

'use strict';

var obsidian = require('obsidian');
var state = require('@codemirror/state');
var view = require('@codemirror/view');

class WordCountMd extends obsidian.Plugin
{
	onload()
	{
		WordCountMd .statusBar = this.addStatusBarItem();
		this.createCMExtension();
	}

	createCMExtension()
	{
		const cmStateField = state.StateField.define(
		{
			create(state)
			{
				return view.Decoration.none;
			},
			update(effects, tr)
			{
				let text = "";
				const selection = tr.newSelection.main;
				if (selection.empty)
				{
					const textIter = tr.newDoc.iter();
					while (!textIter.done)
					{
						text = text + textIter.next().value;
					}
				}
				else
				{
					const textIter = tr.newDoc.iterRange(selection.from, selection.to);
					while (!textIter.done)
					{
						text = text + textIter.next().value;
					}
				}
				WordCountMd.updateStatusBar(text);
				return effects;
			},
			provide: (f) => view.EditorView.decorations.from(f),
		});

		this.registerEditorExtension(cmStateField);
	}

	static updateStatusBar(text)
	{
		const words = text?.match(/[^\s/]*([a-zA-Z0-9])[^\s/]*/g)?.length || 0;
		const chars = text.length;
		WordCountMd.statusBar.setText(`${words} words ${chars} characters`);
	}
}

module.exports = WordCountMd;
