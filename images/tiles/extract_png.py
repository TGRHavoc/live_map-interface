import os
import zlib
import sys
from read_ytd import YTD
import glob

#filename = input("Please enter the file name > ")

for ytd_file in list(glob.glob("minimap_*.ytd")):
	print(ytd_file)
	ytd = YTD(ytd_file)
	ytd.finished()
