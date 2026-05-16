import { useEffect, useState } from 'react';

interface Props {
  value?: string;
  onSave: (value: string) => void;
  placeholder?: string;
}

/** 表格内备注：本地编辑，失焦或 Enter 时再提交，避免整表重渲染导致无法输入 */
export function InlineRemarkField({ value = '', onSave, placeholder = '备注说明' }: Props) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const commit = () => {
    const trimmed = draft.trim();
    if (trimmed !== value.trim()) {
      onSave(trimmed);
    }
  };

  return (
    <input
      type="text"
      className="input min-w-[10rem] !py-1.5"
      value={draft}
      placeholder={placeholder}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        e.stopPropagation();
        if (e.key === 'Enter') {
          e.preventDefault();
          e.currentTarget.blur();
        }
      }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    />
  );
}
