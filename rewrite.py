import subprocess
import re
import datetime

# Get the fast export stream
process = subprocess.Popen(['git', 'fast-export', '--all'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
stdout, stderr = process.communicate()
export_data = stdout

# The user wants dates from July 16, 2026 to July 27, 2026.
start_time = datetime.datetime(2026, 7, 16, 10, 0, 0, tzinfo=datetime.timezone.utc)
current_time = start_time

def replace_date(match):
    global current_time
    timestamp = int(current_time.timestamp())
    tz_str = b"+0000"
    
    ret = match.group(1) + match.group(2) + str(timestamp).encode('utf-8') + b" " + tz_str
    if match.group(1) == b'committer ':
        current_time += datetime.timedelta(hours=14, minutes=15)
    return ret

# Regex to match author and committer lines
pattern = b'(author |committer )([^>]+> )(\\d+ [+-]\\d{4})'
new_export_data = re.sub(pattern, replace_date, export_data)

# Import it back
import_process = subprocess.Popen(['git', 'fast-import', '--force'], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
import_stdout, import_stderr = import_process.communicate(input=new_export_data)

print("STDOUT:", import_stdout.decode('utf-8', errors='ignore'))
print("STDERR:", import_stderr.decode('utf-8', errors='ignore'))

subprocess.run(['git', 'reset', '--hard', 'master'])
