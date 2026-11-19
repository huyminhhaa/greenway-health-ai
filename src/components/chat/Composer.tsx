import { useEffect, useRef, useState, type ClipboardEvent, type FormEvent, type KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp, ImagePlus, X } from 'lucide-react';
import { useHealthStore } from '../../store/useHealthStore';
import type { ChatAttachment } from '../../types/healthcare';
import { uid } from '../../lib/health';

const MAX_FILES = 5;
const MAX_MB = 10;

export interface ComposerHandle {
  addFiles: (files: FileList | File[]) => void;
}

export function Composer({ register }: { register?: (h: ComposerHandle) => void }) {
  const send = useHealthStore((s) => s.send);
  const pending = useHealthStore((s) => s.pending);
  const [text, setText] = useState('');
  const [files, setFiles] = useState<ChatAttachment[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const filesRef = useRef<ChatAttachment[]>([]);
  filesRef.current = files;

  const addFiles = (list: FileList | File[]) => {
    const incoming = Array.from(list);
    const images = incoming.filter((f) => f.type.startsWith('image/'));
    const tooBig = images.filter((f) => f.size > MAX_MB * 1024 * 1024);
    const ok = images.filter((f) => f.size <= MAX_MB * 1024 * 1024);
    const room = MAX_FILES - filesRef.current.length;
    const accepted = ok.slice(0, Math.max(0, room)).map((file) => ({
      id: uid(),
      name: file.name,
      url: URL.createObjectURL(file),
      file,
    }));
    const problems: string[] = [];
    if (images.length < incoming.length) problems.push('chỉ nhận file ảnh');
    if (tooBig.length) problems.push(`ảnh tối đa ${MAX_MB} MB`);
    if (ok.length > room) problems.push(`tối đa ${MAX_FILES} ảnh một lần`);
    setNotice(problems.length ? `Một số file chưa được thêm: ${problems.join(', ')}.` : null);
    filesRef.current = [...filesRef.current, ...accepted];
    setFiles(filesRef.current);
  };

  useEffect(() => {
    register?.({ addFiles });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ô nhập tự giãn theo nội dung, tối đa khoảng 6 dòng.
  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
    el.style.overflowY = el.scrollHeight > 180 ? 'auto' : 'hidden';
  }, [text]);

  const removeFile = (id: string) => {
    const f = filesRef.current.find((x) => x.id === id);
    if (f) URL.revokeObjectURL(f.url);
    filesRef.current = filesRef.current.filter((x) => x.id !== id);
    setFiles(filesRef.current);
  };

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    if (pending || (!text.trim() && files.length === 0)) return;
    void send(text, files);
    setText('');
    filesRef.current = [];
    setFiles([]);
    setNotice(null);
  };

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit();
    }
  };

  const onPaste = (e: ClipboardEvent<HTMLTextAreaElement>) => {
    const imgs = Array.from(e.clipboardData.files).filter((f) => f.type.startsWith('image/'));
    if (imgs.length) {
      e.preventDefault();
      addFiles(imgs);
    }
  };

  const canSend = !pending && (text.trim().length > 0 || files.length > 0);

  return (
    <form className="composer" onSubmit={submit}>
      <AnimatePresence initial={false}>
        {files.length > 0 && (
          <motion.ul
            className="composer__files"
            aria-label="Ảnh sẽ gửi"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {files.map((f) => (
              <li key={f.id} className="thumb">
                <img src={f.url} alt={f.name} width={64} height={64} />
                <button type="button" className="thumb__remove" onClick={() => removeFile(f.id)} aria-label={`Bỏ ảnh ${f.name}`}>
                  <X size={14} aria-hidden="true" />
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      <div className="composer__row">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = '';
          }}
        />
        <button
          type="button"
          className="composer__attach"
          onClick={() => inputRef.current?.click()}
          aria-label="Gửi kèm ảnh"
          title="Gửi kèm ảnh"
        >
          <ImagePlus size={20} aria-hidden="true" />
        </button>
        <label className="visually-hidden" htmlFor="chat-input">
          Tin nhắn cho dược sĩ AI
        </label>
        <textarea
          id="chat-input"
          ref={areaRef}
          name="message"
          rows={1}
          className="composer__input"
          placeholder="Nhắn cho dược sĩ AI…"
          value={text}
          enterKeyHint="send"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKey}
          onPaste={onPaste}
        />
        <button type="submit" className="composer__send" disabled={!canSend} aria-label="Gửi">
          <ArrowUp size={20} aria-hidden="true" />
        </button>
      </div>
      <p className={`composer__hint${notice ? ' is-error' : ''}`} aria-live="polite">
        {notice ?? (
          <>
            <span className="composer__keys">Enter để gửi, Shift + Enter để xuống dòng. </span>
            Gửi kèm tối đa 5 ảnh.
          </>
        )}
      </p>
    </form>
  );
}
