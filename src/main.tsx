import { debounce, Plugin, MarkdownView } from "obsidian";
import { VNumHeadingsListener } from "./VNumHeadingsListener";
import { cmPlugin } from "./cmPlugin";
import { CountPluginSettings, DEFAULT_SETTINGS, SettingTab } from "./settings";
import { Extension } from "@codemirror/state";
import { MarkdownRenderChild } from "obsidian";
import { Cache } from "./cache";
import { NumberGenerator } from "./numberGenerator";

export default class CountPlugin extends Plugin {
	private cmExtension: Extension[];
	public settings: CountPluginSettings;
	public mdNumGenCache = new Cache<NumberGenerator>();
	public mdNumberedSectionCache= new Cache<boolean>();

	isInitialLoad = true;

	resetCache = debounce(
		() => {
			this.mdNumGenCache.clearAll();
		},
		1000,
		true
	);
	
	private lastDocName: string | null = null ;

	vnumheadingsListener: VNumHeadingsListener;
	constructor(app: any, manifest: any) {
		super(app, manifest);		
		this.vnumheadingsListener = new VNumHeadingsListener(this.app);
		this.vnumheadingsListener.start();
		this.vnumheadingsListener.addListener(
			(newValue: string | null, oldValue: string | null) => {
				console.log( `CountPlugin received change notification: ${oldValue} -> ${newValue}`	);
				// Force preview re-render
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (!this.vnumheadingsListener.fileChanged && markdownView && markdownView.getMode() === "preview") {
				  markdownView.previewMode.rerender(true);
				  console.log( "Force preview refresh: previewMode.rerender(true)" );
				}
			}
		);
	}

	async onload(): Promise<void> {
		await this.loadSettings();
		this.addSettingTab(new SettingTab(this.app, this));

		this.updateRefreshSettings();

		this.registerEditorExtension(cmPlugin(this));

		this.registerEvent(
			this.app.workspace.on("editor-change", (file, mdView) => {
				(mdView as any).previewMode?.rerender(true);
			})
		);

		this.registerEvent(
			this.app.metadataCache.on("changed", () => {
				this.resetCache();
			})
		);
		
		this.registerEvent(this.app.workspace.on("active-leaf-change", () => {
			this.resetCache();
			})
		);

		this.registerMarkdownPostProcessor((element, context) => {
			if(this.vnumheadingsListener.currentVNumHeadings !== "1" )
				return;
				
			const headings =
				element.querySelectorAll<HTMLElement>("h1,h2,h3,h4,h5,h6");
			if (headings.length === 0)
				return;
				
			const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
			if (markdownView && markdownView.getMode() === "preview") {			
				const docName = context.sourcePath?.split("/").pop()?? null;
				if(docName !== this.lastDocName)
				{
				  this.mdNumGenCache.clearAll();
				  this.mdNumberedSectionCache.clearAll();
				}
				this.lastDocName = docName;
			}



			for (const h of headings) {				
				if (element.closest('.print') !== null && h.classList.contains('__title__')) {
				  console.log('PDF export: Skip inline title, dont number its heading');
				  continue;
				}
				
				if (markdownView && markdownView.getMode() === "preview") {
					const section = context.getSectionInfo(h);
					if (!section)
						return;
					if(this.mdNumberedSectionCache.exists(section.lineStart)){
						this.mdNumGenCache.clearAll();
						this.mdNumberedSectionCache.clearAll();
					}
					this.mdNumberedSectionCache.set(section.lineStart, true);
				}				

				const docId = context.docId;
				if (!this.mdNumGenCache.exists(docId)) {
					const numGen = new NumberGenerator(this);
					this.mdNumGenCache.set(docId, numGen);
				}
				const numGen = this.mdNumGenCache.get(docId) as NumberGenerator;
			
				const hLvl = Number(h.tagName[1]); 
				const num = numGen ? numGen.nextNum(hLvl) : "";
				context.addChild(new PreviewCount(h, num));
			}
		}, 10);
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) ?? {}
		);
	}

	async updateSettings(settings: Partial<CountPluginSettings>) {
		Object.assign(this.settings, settings);
		await this.saveData(this.settings);
		this.updateRefreshSettings();
	}

	private updateRefreshSettings() {
		this.app.workspace.updateOptions();
	}
}

export class PreviewCount extends MarkdownRenderChild {
	text: string;

	constructor(containerEl: HTMLElement, text: string) {
		super(containerEl);

		this.text = text;
	}

	onload() {
		this.containerEl.createSpan({
			text: this.text,
			prepend: true,
			cls: "custom-heading-count",
		});
	}
}
