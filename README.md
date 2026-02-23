# Visual heading numbering for Obsidian

This plugin adds heading numeration to your Obsidian views.

It adds the headings only **visually** and _doesn't modify your files_! 🎉

-   All 6 heading levels

![Screenshot of headings with added numbers](imgs/screenshot.png)

It also works in the ouline pane:

![image](https://user-images.githubusercontent.com/100810261/208636544-34256930-f36a-4539-9582-398588e281dd.png)


## Installation

The plugin is not yet available in Obsidian community plugin list, so it has to be installed manually for now.

### From GitHub

1. **Download** the [latest release zip file](https://github.com/platon-ivanov/obsidian-visually-numbered-headings/releases/latest)
2. **Extract** the whole `obsidian-visually-numbered-headings` folder from the zip to your vault's plugins folder: `<vault>/.obsidian/plugins/obsidian-visual-numbered-headings`
    > **Note**: On some machines the `.obsidian` folder may be hidden by default.
3. **Enable** the plugin in the `Community plugins` tab
    > **Note**: You might be prompted about [Restricted Mode](https://help.obsidian.md/Advanced+topics/Community+plugins#Safe+Mode). You can disable it and enable the plugin. Another way is to head to Settings → Community plugins. Disable Restricted mode and enable the plugin from there.

---	
# About this fork

## Fixes and improvements

### 🐞 Bug Fix: Incorrect heading levels during PDF export

**Problem**

The original implementation generated numbering using the **level of the last heading** for all headings, caused incorrect numbering during **PDF export**, where the rendered DOM structure differs from preview mode.

**Fix**

Each heading now uses its **own level** when generating numbers. Additionally, during PDF export, inline page titles are skipped to avoid numbering unintended headings, This resolves incorrect numbering such as `0.x`, skipped levels, and mismatched hierarchy in exported PDFs.

### ✨ New Feature: Frontmatter-based heading numbering toggle

A new standalone listener, **`VNumHeadingsListener`**, has been introduced to monitor changes to the `vnumheadings` frontmatter field.

* Listens for metadata changes in the active file
* Enables or disables heading numbering in real time，Heading numbering can be toggled using the frontmatter property: vnumheadings. Omitting the property or setting vnumheadings to 1 enables numbering, while setting it to 0 disables it.
* Triggers a preview re-render when the value changes
* Enable heading numbering by default unless vnumheadings is set to 0, If the vnumheadings option is not set, numbering will still be applied. Numbering is disabled only when vnumheadings is explicitly set to 0.

This allows users to control heading numbering **per document**, without reloading or reopening the file.

### ✨ New Feature: PDF Export Heading Styles

During PDF export, the document title is rendered centered, and its color follows the theme CSS variable
`--inline-title-color by default`.

To allow further customization, two optional CSS snippets are provided:

`Snippets-pdf-heading-color.css`
Customize the colors of different heading levels (H1–H6) in exported PDFs.

`Snippets-pdf-title-color.css`
Customize the document title color specifically for PDF export.

These snippets are not enabled automatically.
Users need to manually enable them in Obsidian → Appearance → CSS Snippets.

If these snippets are not enabled, all title and heading colors in the exported PDF will continue to follow the active theme’s color configuration.

## Installation

The plugin is not yet available in Obsidian community plugin list, so it has to be installed manually for now.

### From GitHub

1. **Download** the [latest release zip file](https://github.com/myflocky/obsidian-visually-numbered-headings/releases/latest)
2. **Extract** the whole `obsidian-visually-numbered-headings` folder from the zip to your vault's plugins folder: `<vault>/.obsidian/plugins/obsidian-visual-numbered-headings`
    > **Note**: On some machines the `.obsidian` folder may be hidden by default.
3. **Enable** the plugin in the `Community plugins` tab
    > **Note**: You might be prompted about [Restricted Mode](https://help.obsidian.md/Advanced+topics/Community+plugins#Safe+Mode). You can disable it and enable the plugin. Another way is to head to Settings → Community plugins. Disable Restricted mode and enable the plugin from there.