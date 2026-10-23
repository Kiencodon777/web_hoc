"""Import original PDF text; formula options below were transcribed from rendered pages.
Run pdftotext -layout PDF content-sources/information-extracted.txt before this script.
Answer reasoning is curated separately in content-sources/information-solutions.json.
"""
import json,re,pathlib
root=pathlib.Path(__file__).resolve().parents[1]
text=(root/'content-sources/information-extracted.txt').read_text()
questions=[];current=None;option=None;page=1;duplicates=[]
for original in text.splitlines(keepends=True):
 page+=original.count('\f');line=original.replace('\f','').strip()
 if not line:continue
 if line.startswith('Đáp án'):continue
 # Options 1..4 on question 58 are labels, not extra questions.
 m=re.match(r'^(\d{1,3})\s+(.+)$',line)
 numeric58=current and current['number']==58 and m and int(m[1]) in [1,2,3,4]
 if m and not numeric58:
  if current:questions.append(current)
  current={'number':int(m[1]),'page':page,'question':m[2],'options':[]};option=None;continue
 om=re.match(r'^"?([A-D])\.\s*(.*)$',line)
 if numeric58:om=re.match(r'^(\d)\s+(.+)$',line)
 if om and current:
  current['options'].append(om[2].strip());option=len(current['options'])-1;continue
 if current:
  if option is None:current['question']+=' '+line
  else:current['options'][option]+=' '+line
if current:questions.append(current)
unique={}
for q in questions:
 if q['number'] in unique:
  assert q['question']==unique[q['number']]['question'] and q['options']==unique[q['number']]['options']
  duplicates.append(q['number']);continue
 unique[q['number']]=q
assert set(unique)==set(range(1,152)),set(range(1,152))-set(unique)
assert duplicates==[26,27]
formulas={15:['f ≥ f_max','f ≥ 1,5 f_max','f ≥ 2 f_max','f ≥ f_max'],16:['f = 1/T','f = T','f = T²','f = 2T'],22:['log(p(xᵢ))','1/p(xᵢ)','log(1/p(xᵢ))','p(xᵢ)'],47:['I(xᵢ) = log p(xᵢ)','I(xᵢ) = −log p(xᵢ) = log(1/p(xᵢ))','I(xᵢ) = p(xᵢ)','I(xᵢ) = 1 − p(xᵢ)'],61:['H(X) = Σ p(xᵢ) log(1/p(xᵢ))','H(X) = Σ log p(xᵢ)','H(X) = (1/n) Σ p(xᵢ)','H(X) = Σ p(xᵢ)²'],106:['G = [P | Iₖ]','G = [Iₖ | P]','G = [Iₙ | P]','G = [Iₙ | P]']}
solutions=json.loads((root/'content-sources/information-solutions.json').read_text())
for n,q in unique.items():
 assert len(q['options'])==4,(n,q)
 if n in formulas:q['options']=formulas[n]
 q['question']=q['question'].strip('" ')
 q['options']=[s.strip('" ').replace('\uf0a5','∞') for s in q['options']]
 q['labels']=['1','2','3','4'] if n==58 else list('ABCD')
 q.update(solutions[str(n)])
 assert all(c in 'ABCD' for c in q['answers'])
 assert q['explanation'] and q['sources']
data=list(unique.values())
(root/'dist/information-questions.js').write_text("'use strict';\nconst INFO_QUESTIONS="+json.dumps(data,ensure_ascii=False,indent=2)+';\n')
print('Imported',len(data),'questions; duplicate rows omitted:',duplicates)
print('Graded',sum(bool(q['answers']) for q in data),'Unresolved',[q['number'] for q in data if not q['answers']])
