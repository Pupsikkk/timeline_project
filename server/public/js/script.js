let yearsStep = 50;
let columnWidth = 50;

const DPI = 2
const startYearLineX = 10;
const deltaYears = 10;
const yearsLinesWidth = 3;

 
let table = new Table(1770,2021,1,20)
let DB = new Data()

DB.addNote(1, 'Шалавинский Влад', 2001, 2023, 'Личность', "Просто человек", "Типа прогер", vlad_img, null)
DB.addNote(2, 'Шлапак Виктория', 2002, 2023, 'Личность', "Самый ценный человечек", "К-поп", vikki_img, null)
DB.addNote(3, 'Никола Тесла', 1856, 1943, '', '', '', tesla_img, null)
DB.addNote(4, 'Уинстон Черчиль', 1874, 1965, '', '', '', cherchil_img, null)
DB.addNote(5, 'Шалавинская Ольга', 1953, 2023, '', '', '', babushka_img, null)
DB.addNote(6, 'Альберт Эйнштейн', 1879, 1955,'','','',einshtein_img,null)
DB.addNote(7, 'Иосиф Сталин', 1878, 1953,'','','',stalin_img,null)
DB.addNote(8, 'Адольф Гитлер', 1889, 1945,'','','',hitler_img,null)
DB.addNote(9, 'Томас Эдисон', 1847, 1931,'','','',edison_img,null)
DB.addNote(10, 'Джордж Вашингтон', 1732, 1799,'','','', vashington_img,null)
DB.addNote(11, 'Наполеон Бонапарт', 1769, 1821,'','','',napoleon_img,null)
DB.addNote(12, 'Авраам Линкольн', 1809, 1865, '','','',linkoln_img,null)
DB.addNote(13, 'Отто фон Бисмарк', 1815, 1898, '','','',bismark_img,null)
DB.addNote(14, 'Стив Джобс', 1955, 2011, '','','',steve_jobs_img,null)
DB.addNote(15, 'Илон Маск', 1971, 2023, '','','',mask_img,null)
DB.addNote(16, 'Джон Рокфеллер', 1839, 1937, '','','',rockfeller_img,null)
DB.filter(table.fromYear,table.toYear)
DB.structuring(table.toYear, table.yearHeight, columnWidth)
DB.addToTable(table.container, table.containerH, table.yearHeight)