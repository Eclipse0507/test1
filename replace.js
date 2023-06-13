{\rtf1\ansi\ansicpg1252\cocoartf2709
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fnil\fcharset0 Menlo-Regular;}
{\colortbl;\red255\green255\blue255;\red156\green135\blue44;\red242\green245\blue255;\red76\green82\blue116;
\red185\green86\blue32;\red32\green145\blue189;\red177\green121\blue37;}
{\*\expandedcolortbl;;\cssrgb\c67451\c59216\c22353;\cssrgb\c96078\c96863\c100000;\cssrgb\c36863\c40000\c52941;
\cssrgb\c78039\c41961\c16078;\cssrgb\c13333\c63529\c78824;\cssrgb\c75294\c54510\c18824;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\deftab720
\pard\pardeftab720\partightenfactor0

\f0\fs28 \cf2 \cb3 \expnd0\expndtw0\kerning0
const\cf4  path \cf5 =\cf4  require(\cf6 "path"\cf4 );\
\cf2 const\cf4  fs \cf5 =\cf4  require(\cf6 "fs"\cf4 );\
\cf2 const\cf4  yaml \cf5 =\cf4  require(\cf6 "yaml"\cf4 );\
\
\cf2 const\cf4  findPackageFolders \cf5 =\cf4  (startPath, currentPath) \cf5 =>\cf4  \{\
  currentPath \cf5 =\cf4  currentPath \cf5 ||\cf4  startPath;\
  \cf2 const\cf4  files \cf5 =\cf4  fs.readdirSync(currentPath);\
  \cf2 const\cf4  result \cf5 =\cf4  [];\
  files.forEach(file \cf5 =>\cf4  \{\
    \cf2 if\cf4  (file \cf5 ===\cf4  \cf6 "package-lock.json"\cf4 ) \{\
      result.push(currentPath.substring(startPath.length));\
    \}\
    \cf2 else\cf4  \cf2 if\cf4  (file \cf5 !==\cf4  \cf6 "node_modules"\cf4 ) \{\
      \cf2 const\cf4  filename \cf5 =\cf4  path.join(currentPath, file);\
      \cf2 const\cf4  stat \cf5 =\cf4  fs.lstatSync(filename);\
      \cf2 if\cf4  (stat.isDirectory())\{\
        result.push(\cf5 ...\cf4 findPackageFolders(startPath, filename));\
      \}\
    \}\
  \});\
  \cf2 return\cf4  result.sort((a,b) \cf5 =>\cf4  \{ \cf2 return\cf4  a.split(\cf6 "/"\cf4 ).length \cf5 -\cf4  b.split(\cf6 "/"\cf4 ).length; \} );\
\};\
\
\cf2 const\cf4  packageUpdates \cf5 =\cf4  (path) \cf5 =>\cf4  \{\
  \cf2 return\cf4  \{\
    \cf7 "package-ecosystem"\cf5 :\cf4  \cf6 "npm"\cf4 ,\
    \cf7 directory\cf5 :\cf4  path \cf5 ||\cf4  \cf6 "/"\cf4 ,\
    \cf7 schedule\cf5 :\cf4  \{\
      \cf7 interval\cf5 :\cf4  \cf6 "daily"\cf4 \
    \}\
  \}\
\};\
\
\cf2 const\cf4  packages \cf5 =\cf4  findPackageFolders(process.cwd());\
\
\cf2 if\cf4  (packages.length \cf5 >\cf4  \cf5 0\cf4 ) \{\
  \cf2 const\cf4  updates \cf5 =\cf4  packages.map(\cf2 package\cf4  \cf5 =>\cf4  packageUpdates(\cf2 package\cf4 ));\
\
  \cf2 const\cf4  dependabot \cf5 =\cf4  \{\
    \cf7 version\cf5 :\cf4  \cf5 2\cf4 ,\
    updates\
  \}\
  \cf2 const\cf4  dependabotContent \cf5 =\cf4  yaml.stringify(dependabot);\
  fs.mkdirSync(\cf6 ".github"\cf4 );\
  fs.writeFileSync(\cf6 ".github/dependabot.yml"\cf4 , dependabotContent);\
\}\
}