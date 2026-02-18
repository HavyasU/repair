/**
 * Fix mismatched JSX tags left by the animation cleanup.
 * Replaces orphaned </motion.div> with </Box> in dashboard pages,
 * EXCEPT for those that are properly paired with <motion.div whileHover>.
 */
const fs = require('fs');
const path = require('path');

const files = [
    'src/app/dashboard/user/support/page.js',
    'src/app/dashboard/user/repairs/page.js',
    'src/app/dashboard/user/profile/page.js',
    'src/app/dashboard/admin/users/page.js',
    'src/app/dashboard/admin/support/page.js',
    'src/app/dashboard/admin/services/page.js',
    'src/app/dashboard/admin/reports/page.js',
];

files.forEach((f) => {
    const p = path.join('d:/CODE/clg-freelance/repair', f);
    let lines = fs.readFileSync(p, 'utf8').split('\n');

    // Track open motion.div tags and their types
    const stack = [];
    const result = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // Opening motion.div with whileHover — keep as motion.div
        if (/<motion\.div\s[^>]*whileHover/.test(trimmed)) {
            stack.push('motion');
            result.push(line);
        }
        // Opening motion.div WITHOUT whileHover (was variants={item} or container, now <Box>) — track as Box
        else if (/<motion\.div/.test(trimmed)) {
            stack.push('box');
            result.push(line);
        }
        // Closing </motion.div>
        else if (trimmed === '</motion.div>') {
            const type = stack.pop();
            if (type === 'box') {
                // Replace with </Box>
                result.push(line.replace('</motion.div>', '</Box>'));
            } else {
                // Keep as </motion.div>
                result.push(line);
            }
        }
        else {
            result.push(line);
        }
    }

    fs.writeFileSync(p, result.join('\n'), 'utf8');
    console.log('Fixed:', f);
});

console.log('\nAll done!');
