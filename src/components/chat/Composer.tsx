import { useEffect, useRef, useState, type ClipboardEvent, type FormEvent, type KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp, ImagePlus, X } from 'lucide-react';
import { useHealthStore } from '../../store/useHealthStore';
import type { ChatAttachment } from '../../types/healthcare';
import { uid } from '../../lib/health';
import { getT, useT } from '../../i18n';

const MAX_FILES = 5;
const MAX_MB = 10;

export interface ComposerHandle {
  addFiles: (files: FileList | File[]) => void;
}

export function Composer({ register }: { register?: (h: ComposerHandle) => void }) {
  const t = useT();
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
    // addFiles được gọi từ ngoài (kéo thả) qua handle đăng ký một lần, nên đọc từ điển lúc gọi.
    const c = getT().composer;
    const problems: string[] = [];
    if (images.length < incoming.length) problems.push(c.notImage);
    if (tooBig.length) problems.push(c.tooBig(MAX_MB));
    if (ok.length > room) problems.push(c.tooMany(MAX_FILES));
    setNotice(problems.length ? c.skipped(problems.join(', ')) : null);
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
            aria-label={t.composer.filesLabel}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {files.map((f) => (
              <li key={f.id} className="thumb">
                <img src={f.url} alt={f.name} width={64} height={64} />
                <button type="button" className="thumb__remove" onClick={() => removeFile(f.id)} aria-label={t.composer.remove(f.name)}>
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
          aria-label={t.composer.attach}
          title={t.composer.attach}
        >
          <ImagePlus size={20} aria-hidden="true" />
        </button>
        <label className="visually-hidden" htmlFor="chat-input">
          {t.composer.inputLabel}
        </label>
        <textarea
          id="chat-input"
          ref={areaRef}
          name="message"
          rows={1}
          className="composer__input"
          placeholder={t.composer.placeholder}
          value={text}
          enterKeyHint="send"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKey}
          onPaste={onPaste}
        />
        <button type="submit" className="composer__send" disabled={!canSend} aria-label={t.composer.send}>
          <ArrowUp size={20} aria-hidden="true" />
        </button>
      </div>
      <p className={`composer__hint${notice ? ' is-error' : ''}`} aria-live="polite">
        {notice ?? (
          <>
            <span className="composer__keys">{t.composer.keys}</span>
            {t.composer.limit(MAX_FILES)}
          </>
        )}
      </p>
    </form>
  );
}
