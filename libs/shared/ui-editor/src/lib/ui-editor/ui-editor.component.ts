import { Component, OnDestroy, forwardRef, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

// Tiptap Core & Extensions (V3 - Named Exports)
import { Editor } from '@tiptap/core';
import { StarterKit } from '@tiptap/starter-kit';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table';
import { TableCell } from '@tiptap/extension-table';
import { TableHeader } from '@tiptap/extension-table';
import { Image } from '@tiptap/extension-image';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Youtube } from '@tiptap/extension-youtube';
import { Link } from '@tiptap/extension-link';
import { Underline } from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';

// ngx-tiptap (v14+ Standalone)
import { TiptapEditorDirective, TiptapBubbleMenuDirective } from 'ngx-tiptap';

// NG-ZORRO
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule, NZ_ICONS, NzIconService } from 'ng-zorro-antd/icon';
import {
  BoldOutline,
  ItalicOutline,
  StrikethroughOutline,
  UnderlineOutline,
  PlusOutline,
  FontSizeOutline,
  UnorderedListOutline,
  OrderedListOutline,
  TableOutline,
  PictureOutline,
  YoutubeOutline
} from '@ant-design/icons-angular/icons';

const icons = [
  BoldOutline,
  ItalicOutline,
  StrikethroughOutline,
  UnderlineOutline,
  PlusOutline,
  FontSizeOutline,
  UnorderedListOutline,
  OrderedListOutline,
  TableOutline,
  PictureOutline,
  YoutubeOutline
];
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzDividerModule } from 'ng-zorro-antd/divider';

import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'lib-ui-editor',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    TiptapEditorDirective, // Korrekt: Standalone Directive statt Module
    TiptapBubbleMenuDirective,
    NzButtonModule, 
    NzIconModule, 
    NzToolTipModule, 
    NzDropDownModule,
    NzSpaceModule,
    NzDividerModule,
    NzModalModule,
    NzInputModule
  ],
  templateUrl: './ui-editor.component.html',
  styleUrls: ['./ui-editor.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiEditorComponent),
      multi: true,
    },
    { provide: NZ_ICONS, useValue: icons }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None, // Wichtig für Tiptap Styling
})
export class UiEditorComponent implements OnDestroy, ControlValueAccessor {
  @Input() placeholder = 'Schreib etwas...';
  
  editor: Editor;
  value: any = null;
  isDisabled = false;

  onChange: any = () => {
    // Intentional: Placeholder for ControlValueAccessor
  };
  onTouched: any = () => {
    // Intentional: Placeholder for ControlValueAccessor
  };

  constructor(private iconService: NzIconService) {
    this.iconService.addIcon(...icons);
    this.editor = new Editor({
      extensions: [
        StarterKit,
        Table.configure({ resizable: true }),
        TableRow,
        TableHeader,
        TableCell,
        Image,
        Youtube,
        Underline,
        TextStyle,
        Color,
        Highlight,
        TaskList,
        TaskItem.configure({ nested: true }),
        Link.configure({ openOnClick: false }),
        Placeholder.configure({ placeholder: () => this.placeholder }),
      ],
      onUpdate: ({ editor }) => {
        this.value = editor.getJSON();
        this.onChange(this.value);
      },
    });
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  // ControlValueAccessor methods
  writeValue(value: any): void {
    this.value = value;
    if (this.editor && value) {
      // Fix: Tiptap v3 Options-Format
      this.editor.commands.setContent(value, { emitUpdate: false });
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  // Toolbar Actions
  toggleBold() { this.editor.chain().focus().toggleBold().run(); }
  toggleItalic() { this.editor.chain().focus().toggleItalic().run(); }
  toggleStrike() { this.editor.chain().focus().toggleStrike().run(); }
  toggleUnderline() { this.editor.chain().focus().toggleUnderline().run(); }
  setHeading(level: any) { this.editor.chain().focus().toggleHeading({ level }).run(); }
  toggleBulletList() { this.editor.chain().focus().toggleBulletList().run(); }
  toggleOrderedList() { this.editor.chain().focus().toggleOrderedList().run(); }
  
  isImageModalVisible = false;
  isYoutubeModalVisible = false;
  mediaUrlInput = '';

  insertTable() {
    this.editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }

  openImageModal() {
    this.mediaUrlInput = '';
    this.isImageModalVisible = true;
  }

  handleImageOk() {
    if (this.mediaUrlInput) {
      this.editor.chain().focus().setImage({ src: this.mediaUrlInput }).run();
    }
    this.isImageModalVisible = false;
  }

  openYoutubeModal() {
    this.mediaUrlInput = '';
    this.isYoutubeModalVisible = true;
  }

  handleYoutubeOk() {
    if (this.mediaUrlInput) {
      this.editor.commands.setYoutubeVideo({ src: this.mediaUrlInput });
    }
    this.isYoutubeModalVisible = false;
  }
}
