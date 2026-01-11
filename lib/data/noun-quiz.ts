/**
 * Noun Quiz Data
 * Contains quiz questions for noun types and noun functions
 * Extracted from noun.html
 */

export type NounType = 'Common Noun' | 'Proper Noun' | 'Abstract Noun' | 'Collective Noun'

export type NounFunction = 
  | 'Subject (Chủ ngữ)'
  | 'Object of Verb (Tân ngữ động từ)'
  | 'Complement (Bổ ngữ)'
  | 'Object of Prep (Tân ngữ giới từ)'
  | 'Possessive (Sở hữu cách)'

export interface NounTypeQuestion {
  q: string
  type: NounType
  hint: string
  explain: string
}

export interface NounFunctionQuestion {
  q: string // HTML string with highlighted noun
  ans: string
  hint: string
  explain: string
  options: string[]
}

// Noun Types Quiz Data
export const dataTypes: NounTypeQuestion[] = [
  { q: "Teacher", type: "Common Noun", hint: "Chỉ nghề nghiệp chung chung.", explain: "'Teacher' là danh từ chung chỉ người." },
  { q: "Hanoi", type: "Proper Noun", hint: "Tên một thành phố cụ thể.", explain: "'Hanoi' là tên riêng, luôn viết hoa." },
  { q: "Happiness", type: "Abstract Noun", hint: "Cảm xúc, không thể sờ thấy.", explain: "'Happiness' là danh từ trừu tượng." },
  { q: "Team", type: "Collective Noun", hint: "Một nhóm người.", explain: "'Team' là danh từ tập hợp." },
  { q: "Microsoft", type: "Proper Noun", hint: "Tên công ty cụ thể.", explain: "Tên riêng của tổ chức, viết hoa." },
  { q: "Courage", type: "Abstract Noun", hint: "Sự dũng cảm.", explain: "'Courage' là danh từ trừu tượng chỉ phẩm chất." },
  { q: "London", type: "Proper Noun", hint: "Thủ đô nước Anh.", explain: "Tên riêng địa danh." },
  { q: "Audience", type: "Collective Noun", hint: "Nhóm khán giả.", explain: "'Audience' là danh từ tập hợp." },
  { q: "River", type: "Common Noun", hint: "Dòng sông (chung chung).", explain: "'River' là danh từ chung." },
  { q: "Freedom", type: "Abstract Noun", hint: "Sự tự do.", explain: "Khái niệm trừu tượng." },
  { q: "Monday", type: "Proper Noun", hint: "Một ngày trong tuần.", explain: "Các thứ trong tuần là Danh từ riêng." },
  { q: "Army", type: "Collective Noun", hint: "Quân đội.", explain: "'Army' là tập hợp lính." },
  { q: "Friendship", type: "Abstract Noun", hint: "Tình bạn.", explain: "Mối quan hệ tình cảm -> Trừu tượng." },
  { q: "Doctor", type: "Common Noun", hint: "Nghề nghiệp bác sĩ.", explain: "Danh từ chung chỉ người." },
  { q: "Toyota", type: "Proper Noun", hint: "Tên hãng xe.", explain: "Thương hiệu cụ thể là danh từ riêng." },
  { q: "Flock", type: "Collective Noun", hint: "Bầy chim/cừu.", explain: "'Flock' là danh từ tập hợp." },
  { q: "July", type: "Proper Noun", hint: "Tháng 7.", explain: "Tháng trong năm là Danh từ riêng." },
  { q: "Honesty", type: "Abstract Noun", hint: "Tính trung thực.", explain: "Phẩm chất đạo đức -> Trừu tượng." },
  { q: "Computer", type: "Common Noun", hint: "Đồ vật điện tử.", explain: "Danh từ chung." },
  { q: "Titanic", type: "Proper Noun", hint: "Tên con tàu.", explain: "Tên riêng của tàu." }
]

// Noun Functions Quiz Data
export const dataFunctions: NounFunctionQuestion[] = [
  { q: "<span class='text-indigo-600 border-b-4 border-indigo-300'>Tom</span> arrived late.", ans: "Subject (Chủ ngữ)", hint: "Đứng trước động từ.", explain: "Tom thực hiện hành động -> Chủ ngữ.", options: ["Subject (Chủ ngữ)", "Object (Tân ngữ)", "Complement (Bổ ngữ)", "Possessive (Sở hữu)"] },
  { q: "I saw <span class='text-indigo-600 border-b-4 border-indigo-300'>Tom</span>.", ans: "Object of Verb (Tân ngữ động từ)", hint: "Đứng sau động từ 'saw'.", explain: "Tom chịu tác động -> Tân ngữ.", options: ["Subject (Chủ ngữ)", "Object of Verb (Tân ngữ động từ)", "Complement (Bổ ngữ)", "Object of Prep (Tân ngữ giới từ)"] },
  { q: "She is a <span class='text-indigo-600 border-b-4 border-indigo-300'>teacher</span>.", ans: "Complement (Bổ ngữ)", hint: "Đứng sau tobe 'is'.", explain: "Giải thích She là ai -> Bổ ngữ.", options: ["Object (Tân ngữ)", "Complement (Bổ ngữ)", "Subject (Chủ ngữ)", "Possessive (Sở hữu)"] },
  { q: "I talk to <span class='text-indigo-600 border-b-4 border-indigo-300'>Tom</span>.", ans: "Object of Prep (Tân ngữ giới từ)", hint: "Đứng sau giới từ 'to'.", explain: "Đứng sau giới từ -> Tân ngữ giới từ.", options: ["Object of Verb (Tân ngữ động từ)", "Object of Prep (Tân ngữ giới từ)", "Subject (Chủ ngữ)", "Complement (Bổ ngữ)"] },
  { q: "This is <span class='text-indigo-600 border-b-4 border-indigo-300'>Tom's</span> book.", ans: "Possessive (Sở hữu cách)", hint: "Có dấu 's.", explain: "Chỉ sự sở hữu -> Sở hữu cách.", options: ["Subject (Chủ ngữ)", "Possessive (Sở hữu cách)", "Object (Tân ngữ)", "Complement (Bổ ngữ)"] },
  { q: "<span class='text-indigo-600 border-b-4 border-indigo-300'>Birds</span> can fly.", ans: "Subject (Chủ ngữ)", hint: "Đứng đầu câu.", explain: "Chủ thể hành động -> Chủ ngữ.", options: ["Subject (Chủ ngữ)", "Object (Tân ngữ)", "Complement (Bổ ngữ)", "Possessive (Sở hữu)"] },
  { q: "She bought a <span class='text-indigo-600 border-b-4 border-indigo-300'>car</span>.", ans: "Object of Verb (Tân ngữ động từ)", hint: "Đứng sau động từ 'bought'.", explain: "Mua cái gì? -> Tân ngữ động từ.", options: ["Subject (Chủ ngữ)", "Object of Verb (Tân ngữ động từ)", "Complement (Bổ ngữ)", "Possessive (Sở hữu)"] },
  { q: "They became <span class='text-indigo-600 border-b-4 border-indigo-300'>doctors</span>.", ans: "Complement (Bổ ngữ)", hint: "Đứng sau động từ nối.", explain: "Sau động từ nối là Bổ ngữ.", options: ["Object (Tân ngữ)", "Complement (Bổ ngữ)", "Subject (Chủ ngữ)", "Possessive (Sở hữu)"] },
  { q: "We live in <span class='text-indigo-600 border-b-4 border-indigo-300'>Vietnam</span>.", ans: "Object of Prep (Tân ngữ giới từ)", hint: "Đứng sau giới từ 'in'.", explain: "Tân ngữ giới từ.", options: ["Object of Verb (Tân ngữ động từ)", "Object of Prep (Tân ngữ giới từ)", "Subject (Chủ ngữ)", "Complement (Bổ ngữ)"] },
  { q: "<span class='text-indigo-600 border-b-4 border-indigo-300'>The sun</span> is hot.", ans: "Subject (Chủ ngữ)", hint: "Đứng đầu câu.", explain: "Chủ ngữ của câu.", options: ["Subject (Chủ ngữ)", "Object (Tân ngữ)", "Complement (Bổ ngữ)", "Possessive (Sở hữu)"] },
  { q: "Looking for <span class='text-indigo-600 border-b-4 border-indigo-300'>keys</span>.", ans: "Object of Prep (Tân ngữ giới từ)", hint: "Sau giới từ 'for'.", explain: "Tân ngữ giới từ.", options: ["Object of Verb (Tân ngữ động từ)", "Object of Prep (Tân ngữ giới từ)", "Subject (Chủ ngữ)", "Complement (Bổ ngữ)"] },
  { q: "He seems <span class='text-indigo-600 border-b-4 border-indigo-300'>nice</span>.", ans: "Complement (Bổ ngữ)", hint: "Sau 'seems'.", explain: "Mô tả chủ ngữ -> Bổ ngữ.", options: ["Object (Tân ngữ)", "Complement (Bổ ngữ)", "Subject (Chủ ngữ)", "Possessive (Sở hữu)"] },
  { q: "<span class='text-indigo-600 border-b-4 border-indigo-300'>Mary's</span> cat.", ans: "Possessive (Sở hữu cách)", hint: "Có dấu 's.", explain: "Sở hữu cách.", options: ["Subject (Chủ ngữ)", "Possessive (Sở hữu cách)", "Object (Tân ngữ)", "Complement (Bổ ngữ)"] },
  { q: "Listen to <span class='text-indigo-600 border-b-4 border-indigo-300'>music</span>.", ans: "Object of Prep (Tân ngữ giới từ)", hint: "Sau 'to'.", explain: "Tân ngữ giới từ.", options: ["Object of Verb (Tân ngữ động từ)", "Object of Prep (Tân ngữ giới từ)", "Subject (Chủ ngữ)", "Complement (Bổ ngữ)"] },
  { q: "Loves <span class='text-indigo-600 border-b-4 border-indigo-300'>coffee</span>.", ans: "Object of Verb (Tân ngữ động từ)", hint: "Sau 'loves'.", explain: "Tân ngữ động từ.", options: ["Subject (Chủ ngữ)", "Object of Verb (Tân ngữ động từ)", "Complement (Bổ ngữ)", "Possessive (Sở hữu)"] }
]

// Answer options for types mode
export const typeOptions: readonly string[] = ["Common Noun", "Proper Noun", "Abstract Noun", "Collective Noun"] as const
